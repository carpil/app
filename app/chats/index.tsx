import React from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { chats } from '@utils/mocks/chats'
import ChatCard from '@components/chats/card'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'
import { ChatResponse } from '~types/responses/chat'

// Mock current user for demo purposes
const currentUser = {
  id: 'user1',
  name: 'Leonardo DiCaprio',
  profilePicture:
    'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg',
}

export default function Chats() {
  const handleChatPress = (chatId: string) => {
    console.log('Chat pressed:', chatId)
  }

  const renderChat = ({ item }: { item: ChatResponse }) => (
    <ChatCard
      chat={item}
      user={currentUser}
      onPress={() => handleChatPress(item.id)}
    />
  )

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
