import { Pressable, Text, StyleSheet } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

interface PrimaryButtonProps {
  text: string
  onPress: () => void
  disabled?: boolean
}

export default function PrimaryButton({
  text,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }],
  },
  text: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  pressedButton: {
    borderRadius: 8,
    backgroundColor: COLORS.primary_dark,
    color: COLORS.black,
  },
  disabledButton: {
    backgroundColor: COLORS.gray_600,
    transform: [{ scale: 1 }],
  },
  disabledText: {
    color: COLORS.gray_400, // gray-400
  },
})
