import { Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import HeaderBack from '@components/buttons/header-back'

export default function RideLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.dark_gray },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Rides',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'card',
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitle: 'Detalles del ride',
          headerLeft: () => <HeaderBack />,
        }}
      />
    </Stack>
  )
}
