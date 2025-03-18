import { View } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

interface ScreenProps {
  children: React.ReactNode
  backgroundColor?: string
}

export default function Screen({
  children,
  backgroundColor = COLORS.primary,
}: ScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor,
        paddingTop: 12,
      }}
    >
      {children}
    </View>
  )
}
