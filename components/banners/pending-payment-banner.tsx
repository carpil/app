import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@utils/constansts/colors'
import { useBootstrapStore } from 'store/useBootstrapStore'

export default function PendingPaymentBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const { pendingPayment } = useBootstrapStore()

  const isOnCheckout = pathname.includes('/checkout/')
  const shouldShow = pendingPayment !== null && !isOnCheckout

  if (!shouldShow) {
    return null
  }

  const handlePress = () => {
    router.push(`/checkout/${pendingPayment.rideId}`)
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { paddingTop: insets.top > 0 ? insets.top + 8 : 12 },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>💳</Text>
        <Text style={styles.text}>Tienes un pago pendiente</Text>
      </View>
      <Text style={styles.actionText}>Pagar →</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.star_yellow,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '600',
  },
  actionText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
})
