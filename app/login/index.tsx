import { useEffect } from 'react'
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
import { GoogleIcon, AppleIcon } from '@components/icons'
import SocialButton from '@components/buttons/social'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
const logo = require('../../assets/logo.png')

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      await GoogleOneTapSignIn.checkPlayServices()
      let userInfo = null

      if (Platform.OS === 'ios') {
        userInfo = await GoogleOneTapSignIn.presentExplicitSignIn()
      } else {
        userInfo = await GoogleOneTapSignIn.signIn()
      }

      // Access user details properly
      console.log(userInfo)
    } catch (error) {
      console.log(error)
      console.error('Google Sign In Error:', error)
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
      webClientId:
        '991234506580-gq74ort2o25p5b5ms8bv06v1s6khq9gg.apps.googleusercontent.com',
      iosClientId:
        '991234506580-gq74ort2o25p5b5ms8bv06v1s6khq9gg.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
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
