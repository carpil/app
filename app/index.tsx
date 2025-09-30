import {
  FirebaseAuthTypes,
  getAuth,
  getIdToken,
  onAuthStateChanged,
} from '@react-native-firebase/auth'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { bootstrapMe, getUser } from 'services/api/user'
import { useAuthStore } from 'store/useAuthStore'
import { useBootstrapStore } from 'store/useBootstrapStore'
import { User } from '~types/user'

export default function Index() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const { login, user: currentUser } = useAuthStore()
  const { setBootstrap } = useBootstrapStore()

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

      const bootstrapResponse = await bootstrapMe()
      if (!bootstrapResponse) {
        console.log('Bootstrap failed')
        return
      }

      login(userResponse.user, token)
      setBootstrap(bootstrapResponse)
    })

    return () => subscriber()
  }, [login, setBootstrap])

  if (initializing) {
    return null
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  if (currentUser?.inRide?.active) {
    const rideId = currentUser.inRide.rideId
    return <Redirect href={`/ride-navigation/${rideId}`} />
  }

  return <Redirect href="/(tabs)" />
}
