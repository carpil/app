import { useState } from 'react'
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

interface ActionButtonProps {
  text: string
  onPress: () => void | Promise<void>
  disabled?: boolean
  type: 'primary' | 'secondary'
}
export default function ActionButton({
  text,
  onPress,
  disabled = false,
  type = 'primary',
}: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = async () => {
    const result = onPress()

    if (result instanceof Promise) {
      setIsLoading(true)
      try {
        await result
      } finally {
        setIsLoading(false)
      }
    }
  }

  const isDisabled = disabled || isLoading

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        type === 'primary' ? styles.primaryButton : styles.secondaryButton,
        pressed && !isDisabled && styles.pressedButton,
        isDisabled && styles.disabledButton,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text style={[styles.text, isDisabled && styles.disabledText]}>
          {text}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  pressedButton: {
    opacity: 0.8,
  },
  disabledButton: {
    backgroundColor: COLORS.gray_600,
  },
  disabledText: {
    color: COLORS.gray_400,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
})
