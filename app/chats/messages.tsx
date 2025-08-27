import { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { BackIcon, SendIcon } from '@components/icons'
import { ChatResponse } from '~types/responses/chat'
import { COLORS } from '@utils/constansts/colors'
import { formatDate } from '@utils/format-date'
import { getChat, sendMessage } from 'services/api/chats'
import { Link, useLocalSearchParams } from 'expo-router'
import Avatar from '@components/avatar'
import SafeScreen from '@components/safe-screen'
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@react-native-firebase/firestore'
import { Message, MessageBubble } from '~types/message'
import { useAuthStore } from 'store/useAuthStore'
import { decryptMessage } from '@utils/decrypt-message'
import MessageBubbleComponent from '@components/chats/message-bubble'

export default function Messages() {
  const [chat, setChat] = useState<ChatResponse | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<MessageBubble[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { chatId } = useLocalSearchParams()

  const { user } = useAuthStore()

  const userId = user?.id ?? ''

  useEffect(() => {
    const fetchChatAndSetupListener = async () => {
      try {
        setLoading(true)
        setError(null)

        // First, fetch the chat data to get participants
        const chat = await getChat(chatId as string)
        setChat(chat)

        // Only set up the Firestore listener after we have the chat data
        const db = getFirestore()
        const unsubscribe = onSnapshot(
          collection(doc(db, 'chats', chatId as string), 'messages'),
          async (snapshot) => {
            const newMessages = await Promise.all(
              snapshot.docs.map(async (doc: any) => {
                const data = doc.data() as Message

                if (data.seenBy?.includes(userId)) {
                  await updateDoc(
                    doc(db, 'chats', chatId as string, 'messages', doc.id),
                    {
                      seenBy: [...(data.seenBy ?? []), userId],
                    },
                  )
                }

                const user = chat?.participants?.find(
                  (participant) => participant.id === data.userId,
                )

                if (!user) {
                  return null
                }

                const message: MessageBubble = {
                  id: doc.id,
                  content: decryptMessage(data.content),
                  createdAt: data.createdAt,
                  user,
                  isMe: data.userId === userId,
                }

                return message
              }),
            )
            setMessages(newMessages)
          },
        )

        return unsubscribe
      } catch (err) {
        setError('No se encontró el chat')
        console.error('Error fetching chat:', err)
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

  const title =
    chat.ride?.origin?.name.primary +
    ' ➡️ ' +
    chat.ride?.destination?.name.primary

  const departureTime = formatDate(chat.ride?.departureDate ?? new Date())

  const handleSendMessage = async () => {
    const data = await sendMessage(chatId as string, message)
    if (data == null) {
      Alert.alert('Error', 'Error al enviar el mensaje')
      return
    }

    setMessage('')
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Link href="/(tabs)/messages">
            <BackIcon color={COLORS.white} />
          </Link>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.headerTextSecondary}>
              {departureTime.date} {departureTime.hour}
            </Text>
            <View style={styles.headerParticipants}>
              {chat.participants.map((participant) => {
                return (
                  <Avatar key={participant.id} user={participant} size={24} />
                )
              })}
            </View>
          </View>
        </View>

        {/* messages */}
        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <MessageBubbleComponent
              key={message.id}
              user={message.user}
              message={message.content}
              isDriver={message.isMe}
            />
          ))}
        </View>
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
                message.length > 0 ? COLORS.primary : COLORS.inactive_gray,
            }}
            onPress={handleSendMessage}
          >
            <SendIcon
              color={message.length > 0 ? COLORS.white : COLORS.gray_600}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_600,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerTextContainer: {
    marginLeft: 10,
    gap: 4,
  },
  headerTextSecondary: {
    fontSize: 14,
    color: COLORS.gray_400,
  },
  headerParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
    gap: 10,
    margin: 10,
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
})
