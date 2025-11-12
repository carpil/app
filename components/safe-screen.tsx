import { View, StyleSheet, Platform } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { COLORS } from '@utils/constansts/colors'

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
          backgroundColor,
          paddingTop: (Platform.OS === 'ios' ? insets.top : 0) + 16,
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
