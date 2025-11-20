import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import ChatCard from '@components/chats/card'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'
import { ChatResponse } from '~types/responses/chat'
import { getChats } from 'services/api/chats'
import { useAuthStore } from 'store/useAuthStore'
import ChatCardSkeleton from '@components/skeletons/chat-card'

export default function Chats() {
  const [chats, setChats] = useState<ChatResponse[]>([])
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)

  const renderChat = ({ item }: { item: ChatResponse }) => (
    <ChatCard chat={item} user={user!} />
  )

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const chats = await getChats()
        setChats(chats)
      } catch (error) {
        console.error(error)
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
  },
})
