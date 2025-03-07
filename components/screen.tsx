import { View } from 'react-native'
import { COLORS } from '../utils/constansts/colors'

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: COLORS.primary,
        paddingTop: 12,
      }}
    >
      {children}
    </View>
  )
}
