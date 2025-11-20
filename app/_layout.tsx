import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import AppProviders from '@components/providers/app-providers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
import { IOS_GOOGLE_CLIENT_ID } from '@utils/constansts/api'
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: (process.env as any).EXPO_PUBLIC_SENTRY_DSN || undefined,
  replaysSessionSampleRate: 0.8,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration({
      isEmailRequired: false,
      isNameRequired: true,
    }),
  ],
})

export default Sentry.wrap(function RootLayout() {
  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId: Platform.OS === 'ios' ? IOS_GOOGLE_CLIENT_ID : 'autoDetect',
      scopes: ['email', 'profile'],
    })
  }, [])

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProviders>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
