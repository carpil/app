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
  hasBanner?: boolean
}

export default function SafeScreen({
  backgroundColor = COLORS.primary,
  children,
  applyTopInset = true,
  applyBottomInset = false,
  keyboardAware = false,
  hasBanner = false,
}: Props) {
  const insets = useSafeAreaInsets()

  const bannerHeight = hasBanner ? (insets.top > 0 ? insets.top + 68 : 68) : 0
  const basePaddingTop = applyTopInset
    ? (Platform.OS === 'ios' ? insets.top : 0) + 16
    : 16

  const paddingTop = hasBanner ? bannerHeight : basePaddingTop

  const paddingBottom = applyBottomInset ? insets.bottom : 0

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
