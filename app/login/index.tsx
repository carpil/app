import { useEffect, useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import SafeScreen from '@components/safe-screen'
import { GoogleIcon } from '@components/icons'
import SocialButton from '@components/buttons/social'
import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
  OneTapResponse,
} from '@react-native-google-signin/google-signin'
import auth, {
  firebase,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth'
import { IOS_GOOGLE_CLIENT_ID } from '@utils/constansts/api'
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication'

const logo = require('../../assets/logo.png')

const webClientId = Platform.OS === 'ios' ? IOS_GOOGLE_CLIENT_ID : 'autoDetect'

export default function Login() {
  const [token, setToken] = useState('')
  const handleEmailLogin = () => {
    console.log('Email login')
  }

  const handleAppleLogin = async () => {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce } = appleAuthRequestResponse

    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      )
      try {
        console.log('im here')
        const userCredential = await signInWithCredential(
          getAuth(),
          appleCredential,
        )

        console.log('userCredential', userCredential)
      } catch (error) {
        console.log('error', error)
      }
    } else {
      // handle this - retry?
    }
  }

  const handleGoogleLogin = async () => {
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

        console.log(firebaseIdToken)
      } else if (isNoSavedCredentialFoundResponse(response)) {
        console.log('No saved credential found')
      }
    } catch (error) {
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

  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId,
      offlineAccess: true,
      scopes: ['email', 'profile'],
    })
  }, [])

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡Comienza la aventura!</Text>
        <Text style={styles.subtitle}>
          Inicia sesión o crea una cuenta para continuar
        </Text>
        <View style={styles.buttons}>
          <Pressable style={styles.button} onPress={handleEmailLogin}>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                padding: 5,
                textAlign: 'center',
              }}
            >
              Continuar con correo electrónico
            </Text>
          </Pressable>
          <SocialButton
            text="Continuar con Google"
            icon={<GoogleIcon color={COLORS.white} />}
            onPress={handleGoogleLogin}
          />
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 160,
              height: 45,
            }}
            onPress={() => handleAppleLogin()}
          />
        </View>
        <Text style={styles.subtitle}>
          ¿No tienes una cuenta? <Text style={styles.link}>Regístrate</Text>
        </Text>
        <Text style={styles.subtitle}>Token: {token}</Text>
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: COLORS.primary,
  },
  buttons: {
    width: '100%',
    marginTop: 30,
    gap: 20,
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
})
