import { useEffect } from 'react'
import { NotificationProvider } from '@context/notifications'
import LocationProvider from '@context/select-location'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'
import { useTokenRefresh } from 'hooks/useTokenRefresh'
import { STRIPE_PUBLISHABLE_KEY } from '@utils/constansts/api'

interface Props {
  children: React.ReactNode
}

function LoggerAuthSync() {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user) {
      logger.setUser(null)
      logger.info('User logged out', { action: 'user_logout' })
      return
    }

    logger.setUser(user.id, user.email, user.name)
    logger.info('User logged in', {
      action: 'user_login',
      metadata: {
        userId: user.id,
        hasEmail: !!user.email,
        profileCompleted: user.profileCompleted,
      },
    })
  }, [user])

  return null
}

function TokenRefreshSync() {
  useTokenRefresh()
  return null
}

export default function AppProviders({ children }: Props) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <LocationProvider>
        <NotificationProvider>
          <LoggerAuthSync />
          <TokenRefreshSync />
          {children}
        </NotificationProvider>
      </LocationProvider>
    </StripeProvider>
  )
}
