import { View, Text, Image, StyleSheet } from 'react-native'
import { User } from '../types/user'

interface AvatarProps {
  user: User
}
export default function Avatar({ user }: AvatarProps) {
  const { profilePicture } = user

  if (profilePicture === '') {
    const initials = user.name.slice(0, 2).toUpperCase()
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>{initials}</Text>
      </View>
    )
  }

  return <Image source={{ uri: profilePicture }} style={styles.avatar} />
}

const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
    aspectRatio: 1,
  },
  placeholderContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
})
