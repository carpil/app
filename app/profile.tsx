import { Text } from 'react-native'
import Screen from '../components/screen'
import { Stack } from 'expo-router'

export default function Profile() {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#6F52EA',
          },
          headerTitle: 'Profile',
          headerBackTitle: 'Volver',
        }}
      />
      <Text>Profile</Text>
    </Screen>
  )
}
