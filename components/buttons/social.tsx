import { COLORS } from '@utils/constansts/colors'
import { Pressable, StyleSheet, Text } from 'react-native'

interface SocialButtonProps {
  text: string
  icon: React.ReactNode
  onPress: () => void
}

export default function SocialButton({
  text,
  icon,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      {icon}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.black,
    padding: 15,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    padding: 5,
    textAlign: 'center',
  },
})
