import { View, StyleSheet, Text, Image } from 'react-native'
import { User } from '@types/user'
import { COLORS } from '@utils/constansts/colors'

interface PassengerAvatarProps {
  user: User
  size?: number
}
export default function PassengerAvatar({ user }: PassengerAvatarProps) {
  const { profilePicture, name } = user

  if (profilePicture === '') {
    const initials = name.slice(0, 2).toUpperCase()
    return (
      <View style={styles.passengerPlaceholderContainer}>
        <Text style={styles.passengerPlaceholderText}>{initials}</Text>
      </View>
    )
  }

  return (
    <Image source={{ uri: profilePicture }} style={styles.passengerImage} />
  )
}

const styles = StyleSheet.create({
  passengerPlaceholderContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray_600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerPlaceholderText: {
    fontSize: 12,
    color: COLORS.white_gray,
  },
  passengerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.inactive_gray,
  },
})
