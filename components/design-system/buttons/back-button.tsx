import { Platform, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import { BackIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { router } from 'expo-router'

interface BackButtonProps {
  onPress?: () => void
}

const handleBackNavigation = () => {
  // Check if we can navigate back in the stack
  if (router.canGoBack()) {
    router.back()
  } else {
    // Fallback to home tab when coming from notifications on iOS
    router.replace('/(tabs)/')
  }
}

export default function BackButton({
  onPress = handleBackNavigation,
}: BackButtonProps) {
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.iosContainer}>
        <BackIcon color={COLORS.white} />
      </TouchableOpacity>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.androidContainer,
        { backgroundColor: pressed ? COLORS.dark_gray : COLORS.raisin_black },
      ]}
    >
      <BackIcon color={COLORS.white} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  androidContainer: {
    padding: 8,
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iosContainer: {
    marginLeft: 2,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
})
