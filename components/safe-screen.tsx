import { View, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { COLORS } from '@utils/constansts/colors'

interface Props {
  backgroundColor?: string
  children: React.ReactNode
}

export default function SafeScreen({
  backgroundColor = COLORS.primary,
  children,
}: Props) {
  return (
    <SafeAreaProvider>
      <View
        style={{
          ...styles.container,
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
