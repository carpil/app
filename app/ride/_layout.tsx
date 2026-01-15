import { Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import BackButton from '@components/design-system/buttons/back-button'

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
            backgroundColor: COLORS.dark_gray,
          },
          headerTitle: 'Detalles del ride',
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  )
}
