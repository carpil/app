import { View, Text, StyleSheet } from 'react-native'
import { Pressable } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { User } from '~types/user'
import Avatar from '@components/avatar'
import { ChatIcon } from '@components/icons'

interface PassengerCardProps {
  passenger: User
}
export default function PassengerCard({ passenger }: PassengerCardProps) {
  return (
    <View style={styles.passengerCard}>
      <Avatar user={passenger} size={48} />
      <View style={styles.passengerInfo}>
        <Text style={styles.passengerName}>{passenger.name}</Text>
      </View>
      <Pressable style={styles.chatButton}>
        <ChatIcon color={COLORS.white} size={16} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  chatButton: {
    padding: 10,
    backgroundColor: COLORS.dark_gray,
    borderRadius: 8,
  },
})
