import { router, Stack } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import BackButton from '@components/design-system/buttons/back-button'

export default function ChatsLayout() {
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
        name="messages"
        options={{
          headerShown: true,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  )
}
