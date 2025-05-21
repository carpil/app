import { Text } from 'react-native'
import SafeScreen from '@components/safe-screen'
import { useAuthStore } from 'store/useAuthStore'

export default function Profile() {
  const user = useAuthStore((state) => state.user)

  return (
    <SafeScreen>
      <Text>{user?.id}</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </SafeScreen>
  )
}
