import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import ChatCard from '@components/chats/card'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'
import { ChatResponse } from '~types/responses/chat'
import { getChats } from 'services/api/chats'
import { useAuthStore } from 'store/useAuthStore'

export default function Chats() {
  const [chats, setChats] = useState<ChatResponse[]>([])
  const { user } = useAuthStore()

  const renderChat = ({ item }: { item: ChatResponse }) => (
    <ChatCard chat={item} user={user!} />
  )

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats()
      setChats(chats)
    }
    fetchChats()
  }, [])

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
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
