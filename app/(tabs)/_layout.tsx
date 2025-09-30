import { Tabs } from 'expo-router'
import { CarIcon, MessagesIcon, ProfileIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import RatingsModal from 'app/ratings/modal'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useBootstrapStore } from 'store/useBootstrapStore'

export default function TabsLayout() {
  const { pendingReviews } = useBootstrapStore()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.light_gray,
            borderWidth: 0,
          },
          tabBarActiveTintColor: COLORS.secondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <CarIcon color={color} />,
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
      {pendingReviews && pendingReviews.length > 0 && (
        <RatingsModal pendingReviews={pendingReviews} />
      )}
    </GestureHandlerRootView>
  )
}
