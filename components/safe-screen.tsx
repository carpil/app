import { View, StyleSheet } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { COLORS } from '../utils/constansts/colors'

interface Props {
  backgroundColor?: string
  children: React.ReactNode
}

export default function SafeScreen({
  backgroundColor = COLORS.primary,
  children,
}: Props) {
  const insets = useSafeAreaInsets()
  return (
    <SafeAreaProvider>
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
          backgroundColor,
        }}
      >
        {children}
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
})
