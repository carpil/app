import {
  FirebaseAuthTypes,
  onAuthStateChanged,
} from '@react-native-firebase/auth'
import { useEffect } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useState } from 'react'
import { Redirect } from 'expo-router'

export default function Index() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setInitializing(false)
    })

    return () => subscriber()
  }, [])

  if (initializing) {
    return null
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/(tabs)/home" />
}
