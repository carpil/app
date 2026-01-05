import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { useRouter } from 'expo-router'
import ChatCard from '@components/chats/card'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'
import { ChatResponse } from '~types/responses/chat'
import { getChats } from 'services/api/chats'
import { useAuthStore } from 'store/useAuthStore'
import ChatCardSkeleton from '@components/skeletons/chat-card'
import PrimaryButton from '@components/buttons/primary'
import { logger } from '@utils/logs'

export default function Chats() {
  const [chats, setChats] = useState<ChatResponse[]>([])
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const renderChat = ({ item }: { item: ChatResponse }) => (
    <ChatCard chat={item} user={user!} />
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No tienes chats</Text>
      <Text style={styles.emptyMessage}>
        Una vez que te unas a un ride, podrás usar el chat para comunicarte con
        otros pasajeros y el conductor.
      </Text>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          text="Buscar un ride"
          onPress={() => {
            logger.info('Navigate to create ride from empty chats', {
              action: 'empty_chats_navigate',
              metadata: { destination: '/create-ride/select-origin' },
            })
            router.push('/create-ride/select-origin')
          }}
        />
      </View>
    </View>
  )

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const chats = await getChats()
        setChats(chats)
        logger.info('Chats fetched successfully', {
          action: 'fetch_chats_success',
          metadata: { count: chats.length },
        })
      } catch (error) {
        logger.exception(error as Error, {
          action: 'fetch_chats_error',
          metadata: { context: 'Failed to fetch chats' },
        })
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [])

  if (loading) {
    return (
      <SafeScreen backgroundColor={COLORS.dark_gray} applyTopInset={false}>
        <View style={styles.container}>
          <FlatList
            data={Array.from({ length: 5 })}
            renderItem={() => <ChatCardSkeleton />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeScreen>
    )
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray} applyTopInset={false}>
      <View style={styles.container}>
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.gray_400,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
})
