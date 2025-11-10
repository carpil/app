import { Tabs } from 'expo-router'
import { CarIcon, MessagesIcon, ProfileIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import RatingsModal from 'app/ratings/modal'
import { useBootstrap } from 'hooks/useBootstrap'
import CheckoutModal from 'app/checkout/modal'
import { Text, View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RidesHeader = () => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.headerTitle}>Viajes disponibles</Text>
    </View>
  )
}

export default function TabsLayout() {
  const { pendingReviews, pendingPayment } = useBootstrap()

  return (
    <>
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
            title: 'Inicio',
            tabBarIcon: ({ color }) => <CarIcon color={color} />,
            headerShown: true,
            header: () => <RidesHeader />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Mensajes',
            tabBarIcon: ({ color }) => <MessagesIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          }}
        />
      </Tabs>
      {pendingPayment && <CheckoutModal pendingPayment={pendingPayment} />}
      {!pendingPayment && pendingReviews && pendingReviews.length > 0 && (
        <RatingsModal pendingReviews={pendingReviews} />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
})
