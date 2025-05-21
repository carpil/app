import { Text } from 'react-native'
import PrimaryButton from '@components/buttons/primary'
import SafeScreen from '@components/safe-screen'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { useAuthStore } from 'store/useAuthStore'

export default function Home() {
  const logout = useAuthStore((state) => state.logout)
  const onLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    logout()
  }
  return (
    <SafeScreen>
      <Text>Home</Text>
      <PrimaryButton text="Logout" onPress={onLogout} />
    </SafeScreen>
  )
}
