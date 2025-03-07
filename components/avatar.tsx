import { View, Text, Image, StyleSheet } from 'react-native'
import { User } from '../types/user'
import { COLORS } from '../utils/constansts/colors'

interface AvatarProps {
  user: User
  size?: number
}

const DEFAULT_SIZE = 64

export default function Avatar({ user, size = DEFAULT_SIZE }: AvatarProps) {
  const { profilePicture } = user

  if (profilePicture === '') {
    const initials = user.name.slice(0, 2).toUpperCase()
    return (
      <View
        style={{ ...styles.placeholderContainer, width: size, height: size }}
      >
        <Text style={styles.placeholderText}>{initials}</Text>
      </View>
    )
  }

  return (
    <Image
      source={{ uri: profilePicture }}
      style={{ ...styles.avatar, width: size, height: size }}
    />
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    borderRadius: 100,
    resizeMode: 'cover',
    aspectRatio: 1,
  },
  placeholderContainer: {
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    borderRadius: 32,
    backgroundColor: COLORS.gray_600,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.white_gray,
  },
})
