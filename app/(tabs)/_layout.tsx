import { Text, StyleSheet, View } from 'react-native'
import { CarIcon, MessagesIcon, ProfileIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { Tabs } from 'expo-router'
import { useBootstrap } from 'hooks/useBootstrap'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CheckoutModal from 'app/checkout/modal'
import PendingPaymentBanner from '@components/banners/pending-payment-banner'
import RatingsModal from 'app/ratings/modal'

const HeaderTitle = ({
  title,
  color = COLORS.primary,
  hasBannerAbove = false,
}: {
  title: string
  color: string
  hasBannerAbove?: boolean
}) => {
  const insets = useSafeAreaInsets()
  const topPadding = hasBannerAbove ? 16 : insets.top + 16

  return (
    <View
      style={{
        backgroundColor: color,
        paddingTop: topPadding,
        paddingBottom: 10,
        paddingHorizontal: 16,
      }}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  )
}

export default function TabsLayout() {
  const { inRide, rideId, pendingReviews, pendingPayment } = useBootstrap()

  const hasActiveRideBanner = inRide && rideId
  const hasPendingPaymentBanner = pendingPayment !== null
  const hasBanner = Boolean(hasActiveRideBanner || hasPendingPaymentBanner)

  return (
    <View style={styles.container}>
      <PendingPaymentBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.light_gray,
            borderWidth: 0,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: COLORS.secondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Rides',
            tabBarIcon: ({ color }) => <CarIcon color={color} />,
            headerShown: true,
            header: () => (
              <HeaderTitle
                title="Viajes disponibles"
                color={COLORS.primary}
                hasBannerAbove={hasBanner}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            tabBarLabel: 'Chats',
            tabBarIcon: ({ color }) => <MessagesIcon color={color} />,
            headerShown: true,
            header: () => (
              <HeaderTitle
                title="Chats"
                color={COLORS.dark_gray}
                hasBannerAbove={hasBanner}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
            headerShown: true,
            header: () => (
              <HeaderTitle
                title="Perfil"
                color={COLORS.dark_gray}
                hasBannerAbove={hasBanner}
              />
            ),
          }}
        />
      </Tabs>
      {pendingPayment && <CheckoutModal pendingPayment={pendingPayment} />}
      {!pendingPayment && pendingReviews && pendingReviews.length > 0 && (
        <RatingsModal pendingReviews={pendingReviews} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
})
