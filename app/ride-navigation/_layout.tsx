import { Stack, router } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import CloseButton from '@components/design-system/buttons/close-button'

export default function RideNavigationLayout() {
  const handleClose = () => {
    router.replace('/(tabs)')
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTransparent: true,
        headerTintColor: COLORS.white,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[rideId]"
        options={{
          title: '',
          headerShown: true,
          headerRight: () => <CloseButton onPress={handleClose} />,
        }}
      />
    </Stack>
  )
}
