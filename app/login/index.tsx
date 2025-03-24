import { useEffect } from 'react'
import { Text, StyleSheet, Pressable, View, Image } from 'react-native'
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
      console.log('Starting Google Sign In process...')

      // Check if Google Play Services are available
      const checkPlayServices = await GoogleOneTapSignIn.checkPlayServices()
      console.log('Play Services check result:', checkPlayServices)
      const response = await GoogleOneTapSignIn.signIn()

      console.log('Successfully signed in:', response)
    } catch (error) {
      console.error('Google Sign In Error:', error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.ONE_TAP_START_FAILED:
            console.log('One tap start failed')
            break
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available')
            break
          case 'NO_SAVED_CREDENTIAL':
            console.log('No saved credential found')
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
    console.log('Configuring Google Sign In...')
    GoogleOneTapSignIn.configure({
      webClientId:
        '991234506580-gq74ort2o25p5b5ms8bv06v1s6khq9gg.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    })
    console.log('Google Sign In configured')
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    color: COLORS.white,
    marginTop: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  link: {
    color: COLORS.white,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 250,
    height: 250,
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
})
