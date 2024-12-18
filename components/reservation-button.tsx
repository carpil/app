import { Pressable, Text, StyleSheet } from 'react-native'

interface ReservationButtonProps {
  onPress: () => void
  disabled?: boolean
}
export default function ReservationButton({
  onPress,
  disabled = false,
}: ReservationButtonProps) {
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
      <Text style={[styles.text, disabled && styles.disabledText]}>
        Reservar espacio
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2AADAD', // secondary color
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }],
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pressedButton: {
    borderRadius: 8,
    backgroundColor: '#18C5C5', // secondary-dark
  },
  disabledButton: {
    backgroundColor: '#4B5563', // gray-600
    transform: [{ scale: 1 }],
  },
  disabledText: {
    color: '#9CA3AF', // gray-400
  },
})
