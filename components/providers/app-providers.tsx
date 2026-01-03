import { useEffect } from 'react'
import { NotificationProvider } from '@context/notifications'
import LocationProvider from '@context/select-location'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'
import { StyledAlertProvider } from '@components/styled-alert'

interface Props {
  children: React.ReactNode
}

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''

/**
 * Component that syncs authentication state with the logger
 * Updates user context in Sentry and Crashlytics when auth changes
 */
function LoggerAuthSync() {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user) {
      // User logged in - set user context
      logger.setUser(user.id, user.email, user.name)
      logger.info('User logged in', {
        action: 'user_login',
        metadata: {
          userId: user.id,
          hasEmail: !!user.email,
          profileCompleted: user.profileCompleted,
        },
      })
    } else {
      // User logged out - clear user context
      logger.setUser(null)
      logger.info('User logged out', {
        action: 'user_logout',
      })
    }
  }, [user])

  return null
}

export default function AppProviders({ children }: Props) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <LocationProvider>
        <NotificationProvider>
          <StyledAlertProvider>
            <LoggerAuthSync />
            {children}
          </StyledAlertProvider>
        </NotificationProvider>
      </LocationProvider>
    </StripeProvider>
  )
}
