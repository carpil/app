import { Text, View, StyleSheet, Pressable, Linking, Alert } from 'react-native'
import { useState, useRef } from 'react'
import Screen from '@components/screen'
import { useAuthStore } from 'store/useAuthStore'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import ActionButton from '@components/design-system/buttons/action-button'
import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'
import { ChevronRightIcon } from '@components/icons'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'
import { logger } from '@utils/logs'

const environment = (process.env as any).EXPO_PUBLIC_ENVIRONMENT ?? 'unknown'
const appVersion = Constants.expoConfig?.version ?? 'unknown'
const sentryDsn = (process.env as any).EXPO_PUBLIC_SENTRY_DSN ?? ''

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const [tapCount, setTapCount] = useState(0)
  const tapTimeout = useRef<NodeJS.Timeout | null>(null)

  const logout = useAuthStore((state) => state.logout)
  const onLogout = async () => {
    try {
      try {
        await GoogleOneTapSignIn.signOut()
      } catch (error) {
        console.log('Google Sign-In sign out:', error)
      }
      const auth = getAuth()
      await signOut(auth)
      logout()
      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
      logout()
      router.replace('/login')
    }
  }

  const handleSupportPress = async () => {
    await Linking.openURL('https://wa.me/50684481439')
  }

  const handleReportErrorPress = async () => {
    if (!user) return

    Sentry.setUser({
      id: user.id,
      email: user.email || undefined,
      username: user.name || undefined,
    })
    Sentry.showFeedbackWidget()
  }

  const handleDebugInfoPress = () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current)
    }

    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

    if (newTapCount === 2) {
      setTapCount(0)
      forceTestError()
    } else {
      tapTimeout.current = setTimeout(() => {
        setTapCount(0)
      }, 500)
    }
  }

  const forceTestError = () => {
    Alert.alert(
      'Probando tracking',
      'Se enviará un error de prueba a Sentry y Crashlytics',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          style: 'destructive',
          onPress: () => {
            logger.error('Error de prueba forzado por usuario', {
              action: 'test_error_forced',
              metadata: {
                userId: user?.id,
                environment,
                appVersion,
              },
            })

            const testError = new Error('Test error from profile double-tap')
            logger.exception(testError, {
              action: 'test_exception_forced',
              metadata: {
                userId: user?.id,
                environment,
                appVersion,
              },
            })

            Alert.alert(
              'Enviado',
              `Error de prueba enviado.\n\nEntorno: ${environment}\nVersión: ${appVersion}\nSentry DSN: ${sentryDsn ? 'Configurado ✅' : 'NO CONFIGURADO ❌'}\n\nRevisa Sentry y Firebase Crashlytics en 1-2 minutos.`,
            )
          },
        },
      ],
    )
  }

  if (!user) {
    return null
  }

  return (
    <Screen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Avatar
            user={{
              id: user.id,
              name: user.name,
              profilePicture: user.profilePicture,
            }}
            size={80}
          />
          <Text style={styles.userName}>{user.name}</Text>
          {user.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </View>

        <View style={styles.menuSection}>
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={handleSupportPress}
          >
            <Text style={styles.menuItemText}>Soporte técnico</Text>
            <ChevronRightIcon color={COLORS.gray_400} size={20} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={handleReportErrorPress}
          >
            <Text style={styles.menuItemText}>Reportar un error</Text>
            <ChevronRightIcon color={COLORS.gray_400} size={20} />
          </Pressable>
        </View>

        <View style={styles.logoutContainer}>
          <ActionButton
            text="Cerrar sesión"
            onPress={onLogout}
            type="primary"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.debugInfo,
            pressed && styles.debugInfoPressed,
          ]}
          onPress={handleDebugInfoPress}
        >
          <Text style={styles.debugInfoText}>
            Versión {appVersion} ({environment})
          </Text>
          <Text style={styles.debugInfoHint}>Toca dos veces para probar</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.inactive_gray,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_400,
  },
  userName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inactive_gray,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_400,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 'auto',
  },
  debugInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border_gray,
    marginTop: 8,
  },
  debugInfoPressed: {
    backgroundColor: COLORS.gray_600,
  },
  debugInfoText: {
    color: COLORS.gray_400,
    fontSize: 12,
    fontWeight: '600',
  },
  debugInfoHint: {
    color: COLORS.gray_600,
    fontSize: 10,
    marginTop: 2,
  },
})
