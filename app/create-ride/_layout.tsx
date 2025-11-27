import { Stack, router } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import BackButton from '@components/design-system/buttons/back-button'
import CloseButton from '@components/design-system/buttons/close-button'
import { useContext } from 'react'
import { SelectLocationContext } from '@context/select-location'

export default function CreateRideLayout() {
  const { reset } = useContext(SelectLocationContext)

  const handleClose = () => {
    reset()
    router.replace('/(tabs)')
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.dark_gray,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-origin"
        options={{
          title: 'Selecciona tu origen',
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="select-destination"
        options={{
          title: 'Selecciona tu destino',
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="select-meeting-point"
        options={{
          title: 'Punto de encuentro',
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="ride-overview"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerRight: () => <CloseButton onPress={handleClose} />,
        }}
      />
      <Stack.Screen
        name="ride-type"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerRight: () => <CloseButton onPress={handleClose} />,
        }}
      />
      <Stack.Screen
        name="ride-request-overview"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerRight: () => <CloseButton onPress={handleClose} />,
        }}
      />
    </Stack>
  )
}
