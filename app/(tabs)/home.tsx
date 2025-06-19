import { Text } from 'react-native'
import PrimaryButton from '@components/buttons/primary'
import SafeScreen from '@components/safe-screen'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { useAuthStore } from 'store/useAuthStore'
import { router } from 'expo-router'
import { useNotification } from '@context/notifications'

export default function Home() {
  const logout = useAuthStore((state) => state.logout)
  const onLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    logout()
    router.replace('/login')
  }

  const { expoPushToken, notification, error } = useNotification()

  console.log('expoPushToken', expoPushToken)
  console.log(notification)
  console.log(error)

  return (
    <SafeScreen>
      <Text>Home</Text>
      <PrimaryButton text="Logout" onPress={onLogout} />
      <Text>{expoPushToken}</Text>
      <Text>{notification?.request.content.title}</Text>
      <Text>{error?.message}</Text>
    </SafeScreen>
  )
}
