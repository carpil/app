import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { AppleIcon, GoogleIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { Link, router } from 'expo-router'
import SafeScreen from '@components/safe-screen'
import SocialButton from '@components/buttons/social'
import { handleGoogleLogin } from 'services/auth/google'
import { handleAppleLogin } from 'services/auth/apple'

const logo = require('../../assets/logo.png')

export default function Login() {
  const goToHome = () => {
    router.replace('/')
  }

  const handleTermsAndConditions = () => {
    Linking.openURL('https://www.carpil.app/terms')
  }
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.carpil.app/privacy')
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>¡Comienza la aventura!</Text>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Al registrarte aceptas los{' '}
            <Text style={styles.termsLink} onPress={handleTermsAndConditions}>
              términos y condiciones
            </Text>{' '}
            y{' '}
            <Text style={styles.termsLink} onPress={handlePrivacyPolicy}>
              políticas de privacidad
            </Text>
          </Text>
        </View>
        <View style={styles.buttons}>
          <Link href={`/login/login-email`} asChild>
            <Pressable style={styles.button}>
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
          </Link>
          <SocialButton
            text="Continuar con Google"
            icon={<GoogleIcon color={COLORS.white} />}
            onPress={async () => {
              await handleGoogleLogin()
              goToHome()
            }}
          />
          {Platform.OS === 'ios' && (
            <SocialButton
              text="Continuar con Apple"
              icon={<AppleIcon color={COLORS.white} />}
              onPress={async () => {
                await handleAppleLogin()
                goToHome()
              }}
            />
          )}
        </View>
        <Link href="/signup" asChild>
          <Pressable>
            <Text style={styles.subtitle}>
              ¿No tienes una cuenta? <Text style={styles.link}>Regístrate</Text>
            </Text>
          </Pressable>
        </Link>
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
    marginLeft: 15,
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
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: COLORS.primary,
  },
  buttons: {
    width: '100%',
    marginTop: 30,
    gap: 10,
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
})
