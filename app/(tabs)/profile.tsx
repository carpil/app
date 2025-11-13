import { Text } from 'react-native'
import SafeScreen from '@components/safe-screen'
import { useAuthStore } from 'store/useAuthStore'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import PrimaryButton from '@components/buttons/primary'

export default function Profile() {
  const user = useAuthStore((state) => state.user)

  const logout = useAuthStore((state) => state.logout)
  const onLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    logout()
    router.replace('/login')
  }

  return (
    <SafeScreen applyTopInset={false}>
      <Text>{user?.id}</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>

      <PrimaryButton text="Logout" onPress={onLogout} />
    </SafeScreen>
  )
}
