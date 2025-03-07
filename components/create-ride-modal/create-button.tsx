import { Pressable, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../utils/constansts/colors'

interface CreateRideButtonProps {
  onPress: () => void
  disabled?: boolean
}
export default function CreateRide({
  onPress,
  disabled = false,
}: CreateRideButtonProps) {
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
      <Text style={[styles.text, disabled && styles.disabledText]}>Crear</Text>
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
    color: COLORS.white,
    fontSize: 20,
  },
  pressedButton: {
    borderRadius: 8,
    backgroundColor: COLORS.secondary_dark,
  },
  disabledButton: {
    backgroundColor: COLORS.gray_600,
    transform: [{ scale: 1 }],
  },
  disabledText: {
    color: COLORS.gray_400,
  },
})
