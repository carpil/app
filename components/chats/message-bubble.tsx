import { View, StyleSheet, Text } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { User } from '~types/user'
import Avatar from '@components/avatar'
import { formatDate } from '@utils/format-date'

export default function MessageBubble({
  user,
  message,
  isDriver,
  createdAt,
}: {
  user: User
  message: string
  isDriver: boolean
  createdAt: Date
}) {
  const timestamp = formatDate(createdAt)
  return (
    <View style={isDriver ? styles.messageBubbleDriver : styles.messageBubble}>
      <Avatar user={user} size={24} />
      <View
        style={
          isDriver
            ? styles.messageBubbleContentDriver
            : styles.messageBubbleContent
        }
      >
        <Text style={styles.messageBubbleText}>{message}</Text>
        <Text style={styles.messageBubbleTimestamp}>{timestamp.hour}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  messageBubbleText: {
    fontSize: 14,
    color: COLORS.white,
  },
  messageBubbleTimestamp: {
    fontSize: 12,
    color: COLORS.inactive_gray,
    marginTop: 4,
  },
})
