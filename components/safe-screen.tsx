import { View, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS } from '@utils/constansts/colors'

interface Props {
  backgroundColor?: string
  children: React.ReactNode
  applyTopInset?: boolean
  applyBottomInset?: boolean
  keyboardAware?: boolean
}

export default function SafeScreen({
  backgroundColor = COLORS.primary,
  children,
  applyTopInset = true,
  applyBottomInset = false,
  keyboardAware = false,
}: Props) {
  const insets = useSafeAreaInsets()
  
  const paddingTop = applyTopInset 
    ? (Platform.OS === 'ios' ? insets.top : 0) + 16 
    : 16
  
  const paddingBottom = applyBottomInset 
    ? insets.bottom 
    : 0

  if (keyboardAware) {
    return (
      <KeyboardAwareScrollView
        style={{
          ...styles.container,
          backgroundColor,
          paddingTop,
          paddingBottom,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
    )
  }

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
