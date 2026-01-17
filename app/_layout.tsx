import { Stack, usePathname, useSegments } from 'expo-router'
import { StyleSheet, Platform } from 'react-native'
import { useEffect, useRef } from 'react'
import AppProviders from '@components/providers/app-providers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
import { IOS_GOOGLE_CLIENT_ID } from '@utils/constansts/api'
import * as Sentry from '@sentry/react-native'
import { initializeLogger } from '@utils/logs'
import { logger } from '@utils/logs'

const environment =
  (process.env as any).EXPO_PUBLIC_ENVIRONMENT ?? 'development'

const sentryDsn = (process.env as any).EXPO_PUBLIC_SENTRY_DSN ?? ''

Sentry.init({
  dsn: sentryDsn,
  replaysSessionSampleRate: 0.8,
  replaysOnErrorSampleRate: 1.0,
  environment,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration({
      isEmailRequired: false,
      isNameRequired: true,
    }),
  ],
})

function RootLayoutContent() {
  const pathname = usePathname()
  const segments = useSegments()
  const previousPath = useRef<string>('')

  // Initialize logger on mount
  useEffect(() => {
    const init = async () => {
      await initializeLogger()
      logger.info('App initialized', {
        action: 'app_start',
        metadata: { platform: Platform.OS },
      })
    }
    init()
  }, [])

  // Configure Google Sign In
  useEffect(() => {
    GoogleOneTapSignIn.configure({
      webClientId: Platform.OS === 'ios' ? IOS_GOOGLE_CLIENT_ID : 'autoDetect',
      scopes: ['email', 'profile'],
    })
  }, [])

  // Track navigation changes
  useEffect(() => {
    if (pathname && pathname !== previousPath.current) {
      logger.addBreadcrumb(`Navigated to ${pathname}`, 'navigation', {
        from: previousPath.current || 'app_start',
        to: pathname,
        segments: segments.join('/'),
      })

      logger.info('Screen view', {
        action: 'screen_view',
        screen: pathname,
        metadata: { segments: segments.join('/') },
      })

      previousPath.current = pathname
    }
  }, [pathname, segments])

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
}

export default Sentry.wrap(RootLayoutContent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
