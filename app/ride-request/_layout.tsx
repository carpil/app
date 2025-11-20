import { Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import BackButton from '@components/design-system/buttons/back-button'

export default function RideRequestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.dark_gray },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'card',
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitle: 'Detalle de la solicitud',
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  )
}
