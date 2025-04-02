import { useEffect } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import SafeScreen from '@components/safe-screen'
import { GoogleIcon, AppleIcon } from '@components/icons'
import SocialButton from '@components/buttons/social'
import {
  GoogleOneTapSignIn,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'
const logo = require('../../assets/logo.png')

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      await GoogleOneTapSignIn.checkPlayServices()

      const userInfo = await GoogleOneTapSignIn.signIn()
      if (userInfo.type !== 'success') {
        throw new Error('Google Sign In Error')
      }
      const { idToken, user } = userInfo.data
      console.log({ idToken, user })
    } catch (error) {
      console.error('Google Sign In Error:', error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.ONE_TAP_START_FAILED:
            console.log('User cancelled the sign-in flow')
            break
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress already')
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated')
            break
          default:
            console.log('Other Google Sign In error:', error.code)
        }
      } else {
        console.log('An error that is not related to google sign in occurred')
      }
    }
  }

  const handleEmailLogin = () => {
    console.log('Email login')
  }

  const handleAppleLogin = () => {
    console.log('Apple login')
  }

  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId: 'autoDetect',
      offlineAccess: true,
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
          <SocialButton
            text="Continuar con Apple"
            icon={<AppleIcon color={COLORS.white} />}
            onPress={handleAppleLogin}
          />
        </View>
        <Text style={styles.subtitle}>
          ¿No tienes una cuenta? <Text style={styles.link}>Regístrate</Text>
        </Text>
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
