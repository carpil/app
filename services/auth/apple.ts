import {
  firebase,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth'
import { socialLogin } from 'services/api/auth'
import { User } from '~types/user'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useAuthStore } from 'store/useAuthStore'

export const handleAppleLogin = async () => {
  const loginStore = useAuthStore.getState().login
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
    const { identityToken } = credential

    const appleCredential =
      firebase.auth.AppleAuthProvider.credential(identityToken)
    try {
      const userCredential = await signInWithCredential(
        getAuth(),
        appleCredential,
      )

      console.log('userCredential', userCredential)
      const firebaseIdToken = await userCredential.user?.getIdToken()

      if (!firebaseIdToken) {
        throw new Error('No id token found')
      }

      const user: User = {
        id: userCredential.user?.uid || '',
        name: userCredential.user?.displayName || '',
        profilePicture: userCredential.user?.photoURL || '',
        email: userCredential.user?.email || '',
      }

      const setToken = useAuthStore.getState().setToken
      setToken(firebaseIdToken)

      const userResponse = await socialLogin({ user, token: firebaseIdToken })

      if (userResponse != null) {
        loginStore(userResponse, firebaseIdToken)
      }
    } catch (error) {
      console.log('error', error)
    }
    // signed in
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
}
