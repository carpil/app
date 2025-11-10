import { Platform, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import { CloseIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'

interface CloseButtonProps {
  onPress: () => void
}
export default function CloseButton({ onPress }: CloseButtonProps) {
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.iosContainer}>
        <CloseIcon color={COLORS.white} />
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
      <CloseIcon color={COLORS.white} />
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
