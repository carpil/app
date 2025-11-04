import { Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'

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
          title: '',
          headerBackTitle: 'Atrás',
        }}
      />
    </Stack>
  )
}
