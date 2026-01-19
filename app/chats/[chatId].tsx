import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { SendIcon } from '@components/icons'
import { ChatResponse } from '~types/responses/chat'
import { COLORS } from '@utils/constansts/colors'
import { getChat, sendMessage } from 'services/api/chats'
import { useLocalSearchParams, useNavigation, usePathname } from 'expo-router'
import Avatar from '@components/avatar'
import SafeScreen from '@components/safe-screen'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from '@react-native-firebase/firestore'
import { FirestoreMessage, MessageBubble } from '~types/message'
import { useAuthStore } from 'store/useAuthStore'
import { decryptMessage } from '@utils/decrypt-message'
import MessageBubbleComponent from '@components/chats/message-bubble'
import { logger } from '@utils/logs'
import FirestoreConfig from 'services/firestore/config'
import { useBootstrap } from 'hooks/useBootstrap'

export default function Messages() {
  const [chat, setChat] = useState<ChatResponse | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageBubble[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { chatId } = useLocalSearchParams()
  const navigation = useNavigation()
  const pathname = usePathname()
  const scrollViewRef = useRef<ScrollView>(null)
  const { inRide, rideId, pendingPayment } = useBootstrap()

  const { user } = useAuthStore()

  const userId = user?.id ?? ''

  const isOnRideNavigation = pathname?.includes('/ride-navigation/')
  const isOnCheckout = pathname?.includes('/checkout/')
  const hasActiveRideBanner = inRide && rideId && !isOnRideNavigation && !isOnCheckout
  const hasPendingPaymentBanner = pendingPayment !== null && !isOnCheckout
  const hasBanner = Boolean(hasActiveRideBanner || hasPendingPaymentBanner)

  useLayoutEffect(() => {
    if (chat?.ride?.origin && chat?.ride?.destination) {
      const title =
        chat.ride.origin.name.primary +
        ' ➡️ ' +
        chat.ride.destination.name.primary

      navigation.setOptions({
        headerTitle: () => (
          <View style={headerStyles.headerContainer}>
            <Text style={headerStyles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            <View style={headerStyles.headerParticipants}>
              {chat.participants.map((participant) => (
                <Avatar key={participant.id} user={participant} size={20} />
              ))}
            </View>
          </View>
        ),
      })
    } else {
      navigation.setOptions({
        headerTitle: 'Chat',
      })
    }
  }, [chat, navigation])

  useEffect(() => {
    const fetchChatAndSetupListener = async () => {
      try {
        setLoading(true)
        setError(null)

        const chat = await getChat(chatId as string)
        setChat(chat)

        const db = FirestoreConfig.getDb()
        logger.info('Connected to Firestore database', {
          action: 'firestore_connection',
          metadata: {
            databaseName: FirestoreConfig.getDatabaseName(),
            chatId: chatId as string,
          },
        })

        const messagesQuery = query(
          collection(doc(db, 'chats', chatId as string), 'messages'),
          orderBy('createdAt', 'asc'),
        )
        const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
          logger.info('Firestore snapshot received', {
            action: 'firestore_snapshot_received',
            metadata: {
              chatId: chatId as string,
              docsCount: snapshot.docs.length,
              chatParticipantsCount: chat?.participants?.length ?? 0,
            },
          })

          const newMessages = await Promise.all(
            snapshot.docs.map(async (docSnapshot: any) => {
              try {
                const data = docSnapshot.data() as FirestoreMessage

                logger.info('Processing message', {
                  action: 'processing_firestore_message',
                  metadata: {
                    messageId: docSnapshot.id,
                    userId: data.userId,
                    hasChat: !!chat,
                    participantsCount: chat?.participants?.length ?? 0,
                  },
                })

                if (!data.seenBy?.includes(userId)) {
                  await updateDoc(
                    doc(
                      db,
                      'chats',
                      chatId as string,
                      'messages',
                      docSnapshot.id,
                    ),
                    {
                      seenBy: [...(data.seenBy ?? []), userId],
                    },
                  )
                }

                const user = chat?.participants?.find(
                  (participant) => participant.id === data.userId,
                )

                if (!user) {
                  logger.error('User not found in participants', {
                    action: 'message_user_not_found',
                    metadata: {
                      messageUserId: data.userId,
                      chatParticipants:
                        chat?.participants?.map((p) => p.id) ?? [],
                    },
                  })
                  return null
                }

                const decryptedContent = decryptMessage(data.content)
                const message: MessageBubble = {
                  id: docSnapshot.id,
                  content: decryptedContent,
                  createdAt: data.createdAt.toDate(),
                  user,
                  isMe: data.userId === userId,
                }

                logger.info('Message created successfully', {
                  action: 'message_created',
                  metadata: {
                    messageId: docSnapshot.id,
                    hasContent: !!decryptedContent,
                    hasCreatedAt: !!data.createdAt,
                  },
                })

                return message
              } catch (error) {
                logger.error('Failed to process message', {
                  action: 'message_processing_failed',
                  metadata: {
                    messageId: docSnapshot.id,
                    error: (error as Error).message,
                  },
                })
                return null
              }
            }),
          )
          const filteredMessages = newMessages.filter(
            (msg): msg is MessageBubble => msg !== null,
          )

          logger.info('Messages processed', {
            action: 'messages_processed',
            metadata: {
              chatId: chatId as string,
              totalDocs: snapshot.docs.length,
              filteredCount: filteredMessages.length,
              nullCount: newMessages.filter((m) => m === null).length,
            },
          })

          setMessages(filteredMessages)

          if (filteredMessages.length === 0) {
            logger.info('Chat has no messages yet', {
              action: 'chat_empty_state_shown',
              metadata: { chatId: chatId as string },
            })
          }
        })

        return unsubscribe
      } catch (err) {
        setError('No se encontró el chat')
        logger.exception(err as Error, {
          action: 'setup_chat_listener_error',
          metadata: { chatId: chatId as string },
        })
        return null
      } finally {
        setLoading(false)
      }
    }

    const unsubscribePromise = fetchChatAndSetupListener()

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) unsubscribe()
      })
    }
  }, [chatId, userId])

  if (loading) {
    return (
      <SafeScreen backgroundColor={COLORS.dark_gray}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando chat...</Text>
        </View>
      </SafeScreen>
    )
  }

  if (error || !chat) {
    return (
      <SafeScreen backgroundColor={COLORS.dark_gray}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>💬</Text>
          <Text style={styles.errorTitle}>Chat no encontrado</Text>
          <Text style={styles.errorMessage}>
            {error || 'El chat que buscas no existe o ya no está disponible.'}
          </Text>
        </View>
      </SafeScreen>
    )
  }

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim()

    if (trimmedMessage.length === 0) {
      return
    }

    const data = await sendMessage(chatId as string, trimmedMessage)
    if (data == null) {
      Alert.alert('Error', 'Error al enviar el mensaje')
      return
    }

    setMessage('')
  }

  return (
    <SafeScreen
      backgroundColor={COLORS.dark_gray}
      applyTopInset={false}
      keyboardAware
      hasBanner={hasBanner}
    >
      <View style={styles.container}>
        {/* messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContentContainer}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>Aún no hay mensajes</Text>
              <Text style={styles.emptySubtitle}>Inicia la conversación</Text>
            </View>
          ) : (
            messages.map((message) => (
              <MessageBubbleComponent
                key={message.id}
                user={message.user}
                message={message.content}
                isDriver={message.isMe}
                createdAt={message.createdAt}
              />
            ))
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje"
            placeholderTextColor={COLORS.gray_400}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={{
              ...styles.sendButton,
              backgroundColor:
                message.trim().length > 0
                  ? COLORS.primary
                  : COLORS.inactive_gray,
            }}
            onPress={handleSendMessage}
            disabled={message.trim().length === 0}
          >
            <SendIcon
              color={message.trim().length > 0 ? COLORS.white : COLORS.gray_600}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 30 : 5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    padding: 12,
    gap: 10,
    flexGrow: 1,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageBubbleContent: {
    backgroundColor: COLORS.gray_400,
    padding: 12,
    borderRadius: 12,
    maxWidth: '95%',
  },
  messageBubbleText: {
    fontSize: 14,
  },
  messageBubbleContentDriver: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    maxWidth: '95%',
  },
  messageBubbleDriver: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: COLORS.gray_600,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.gray_600,
    padding: 12,
    borderRadius: 12,
    color: COLORS.white,
    minHeight: 48,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark_gray,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark_gray,
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.gray_400,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray_400,
    textAlign: 'center',
    marginTop: 8,
  },
})

const headerStyles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    gap: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_600,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    // textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  headerParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
    marginTop: 2,
  },
})
