import { Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import BackButton from '@components/design-system/buttons/back-button'

export default function LoginLayout() {
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
        name="login-email"
        options={{
          title: 'Iniciar sesión',
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  )
}
