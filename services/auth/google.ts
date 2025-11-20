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

const handleSignInSuccess = async (idToken: string) => {
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

  const loginStore = useAuthStore.getState().login
  const userResponse = await socialLogin({ user, token: firebaseIdToken })

  if (userResponse != null) {
    loginStore(userResponse, firebaseIdToken)
  }
}

export const handleGoogleLogin = async () => {
  try {
    await GoogleOneTapSignIn.checkPlayServices()
    let response: OneTapResponse

    if (Platform.OS === 'ios') {
      response = await GoogleOneTapSignIn.presentExplicitSignIn()
    } else {
      response = await GoogleOneTapSignIn.signIn()

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.presentExplicitSignIn()
      }
    }

    if (isSuccessResponse(response)) {
      await handleSignInSuccess(response.data.idToken)
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.ONE_TAP_START_FAILED:
          try {
            const response = await GoogleOneTapSignIn.presentExplicitSignIn()
            if (isSuccessResponse(response)) {
              await handleSignInSuccess(response.data.idToken)
            }
          } catch (fallbackError) {
            console.error('Google Sign-In Fallback Error:', fallbackError)
          }
          break
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          break
        default:
      }
    } else {
      console.error('Google Sign-In Error:', error)
    }
  }
}
