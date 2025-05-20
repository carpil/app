import { Text } from 'react-native'
import PrimaryButton from '@components/buttons/primary'
import SafeScreen from '@components/safe-screen'
import { getAuth, signOut } from '@react-native-firebase/auth'

export default function Home() {
  const onLogout = () => {
    const auth = getAuth()
    signOut(auth).then(() => console.log('User signed out!'))
  }
  return (
    <SafeScreen>
      <Text>Home</Text>
      <PrimaryButton text="Logout" onPress={onLogout} />
    </SafeScreen>
  )
}
