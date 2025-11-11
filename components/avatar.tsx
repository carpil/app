import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { User } from '~types/user'
import { COLORS } from '@utils/constansts/colors'
import { useRouter } from 'expo-router'
import { ArrowUpRightIcon } from './icons'

interface AvatarProps {
  user: User
  size?: number
  goToUserDetails?: boolean
}

const DEFAULT_SIZE = 64

export default function Avatar({
  user,
  size = DEFAULT_SIZE,
  goToUserDetails = false,
}: AvatarProps) {
  const { profilePicture, name } = user
  const router = useRouter()

  const handlePress = () => {
    if (goToUserDetails) {
      router.push(`/users/${user.id}`)
    }
  }

  const hasProfilePicture = profilePicture && profilePicture !== ''
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <Pressable
      onPress={handlePress}
      disabled={!goToUserDetails}
      style={({ pressed }) => [
        styles.avatarContainer,
        pressed && styles.avatarPressed,
      ]}
    >
      {({ pressed }) => (
        <>
          {hasProfilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={{ ...styles.avatar, width: size, height: size }}
            />
          ) : (
            <View
              style={{
                ...styles.placeholderContainer,
                width: size,
                height: size,
              }}
            >
              <Text style={styles.placeholderText}>{initials}</Text>
            </View>
          )}
          {pressed && goToUserDetails && (
            <View style={[styles.iconOverlay, { width: size, height: size }]}>
              <ArrowUpRightIcon color={COLORS.white_gray} size={size * 0.4} />
            </View>
          )}
        </>
      )}
    </Pressable>
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
  avatarContainer: {
    borderRadius: 100,
  },
  avatarPressed: {
    opacity: 0.8,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
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
