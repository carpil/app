import {
  FirebaseAuthTypes,
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from '@react-native-firebase/auth'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { getUser } from 'services/api/user'
import { useAuthStore } from 'store/useAuthStore'
import { User } from '~types/user'

export default function Index() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const { login } = useAuthStore()

  useEffect(() => {
    const auth = getAuth()
    const subscriber = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setInitializing(false)
      if (!user) {
        return
      }
      const currentUser: User = {
        id: user?.uid ?? '',
        name: user?.displayName ?? '',
        profilePicture: user?.photoURL ?? '',
        email: user?.email ?? '',
      }
      const token = await getIdToken(user)
      if (!token) {
        return
      }

      const userResponse = await getUser(currentUser.id, token)
      if (!userResponse) {
        console.log('User not found')
        return
      }
      login(userResponse.user, token)
    })

    return () => subscriber()
  }, [login])

  if (initializing) {
    return null
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/(tabs)" />
}
