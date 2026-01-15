import { useState } from 'react'
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

interface ActionButtonProps {
  text: string
  onPress: () => void | Promise<void>
  disabled?: boolean
  type: 'primary' | 'secondary' | 'outline'
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

  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButton
      case 'secondary':
        return styles.secondaryButton
      case 'outline':
        return styles.outlineButton
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        pressed && !isDisabled && styles.pressedButton,
        isDisabled &&
          (type === 'outline'
            ? styles.disabledOutlineButton
            : styles.disabledButton),
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            type === 'outline' && styles.outlineText,
            isDisabled && styles.disabledText,
          ]}
        >
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
    alignItems: 'center',
  },
  pressedButton: {
    opacity: 0.8,
  },
  disabledButton: {
    backgroundColor: COLORS.gray_600,
  },
  disabledOutlineButton: {
    borderColor: COLORS.gray_600,
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.gray_400,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineText: {
    color: COLORS.gray_400,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border_gray,
  },
})
