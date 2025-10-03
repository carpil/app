import { Platform } from 'react-native'
import {
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import {
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  OneTapResponse,
} from '@react-native-google-signin/google-signin'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { User } from '~types/user'
import { useAuthStore } from 'store/useAuthStore'
import { socialLogin } from 'services/api/auth'

export const handleGoogleLogin = async () => {
  const loginStore = useAuthStore.getState().login
  try {
    await GoogleOneTapSignIn.checkPlayServices()
    let response: OneTapResponse
    if (Platform.OS === 'ios') {
      response = await GoogleOneTapSignIn.presentExplicitSignIn()
    } else {
      response = await GoogleOneTapSignIn.signIn()
    }

    if (isSuccessResponse(response)) {
      const { idToken } = response.data

      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      await auth().signInWithCredential(googleCredential)

      const firebaseUser = auth().currentUser
      const firebaseIdToken = await firebaseUser?.getIdToken()

      if (!firebaseIdToken) {
        throw new Error('No id token found')
      }

      const user: User = {
        id: firebaseUser?.uid || '',
        name: firebaseUser?.displayName || '',
        profilePicture: firebaseUser?.photoURL || '',
        email: firebaseUser?.email || '',
      }

      const setToken = useAuthStore.getState().setToken
      setToken(firebaseIdToken)

      const userResponse = await socialLogin({ user, token: firebaseIdToken })

      if (userResponse != null) {
        loginStore(userResponse, firebaseIdToken)
      }
    } else if (isNoSavedCredentialFoundResponse(response)) {
      console.log('No saved credential found')
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error)
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.ONE_TAP_START_FAILED:
          // Android-only, you probably have hit rate limiting.
          // You can still call `presentExplicitSignIn` in this case.
          break
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android: play services not available or outdated.
          // Get more details from `error.userInfo`.
          // Web: when calling an unimplemented api (requestAuthorization)
          // or when the Google Client Library is not loaded yet.
          break
        default:
        // something else happened
      }
    } else {
      // an error that's not related to google sign in occurred
      console.error('Google Sign-In Error:', error)
    }
  }
}
