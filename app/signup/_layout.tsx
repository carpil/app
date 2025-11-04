import { Stack, router } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function SignUpLayout() {
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
          title: '',
          headerBackTitle: 'Atrás',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  )
}
