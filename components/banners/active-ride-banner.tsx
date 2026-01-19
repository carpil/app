import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@utils/constansts/colors'
import { useBootstrap } from 'hooks/useBootstrap'
import { CarIcon } from '@components/icons'

export default function ActiveRideBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const { inRide, rideId } = useBootstrap()

  const isOnRideNavigation = pathname.includes('/ride-navigation/')
  const isOnCheckout = pathname.includes('/checkout/')
  const shouldShow = inRide && rideId && !isOnRideNavigation && !isOnCheckout

  if (!shouldShow) {
    return null
  }

  const handlePress = () => {
    if (rideId) {
      router.replace(`/ride-navigation/${rideId}`)
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { paddingTop: insets.top > 0 ? insets.top : 12 },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <CarIcon color={COLORS.white} size={20} />
        <Text style={styles.text}>Estás en un viaje</Text>
      </View>
      <Text style={styles.actionText}>Ver viaje →</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    backgroundColor: COLORS.primary_dark,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
})
