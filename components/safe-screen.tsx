import { View, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@utils/constansts/colors'

interface Props {
  backgroundColor?: string
  children: React.ReactNode
  applyTopInset?: boolean
  applyBottomInset?: boolean
}

export default function SafeScreen({
  backgroundColor = COLORS.primary,
  children,
  applyTopInset = true,
  applyBottomInset = false,
}: Props) {
  const insets = useSafeAreaInsets()
  
  const paddingTop = applyTopInset 
    ? (Platform.OS === 'ios' ? insets.top : 0) + 16 
    : 16
  
  const paddingBottom = applyBottomInset 
    ? insets.bottom 
    : 0

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor,
        paddingTop,
        paddingBottom,
      }}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
})
