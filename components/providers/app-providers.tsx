import { NotificationProvider } from '@context/notifications'
import LocationProvider from '@context/select-location'
import { StripeProvider } from '@stripe/stripe-react-native'

interface Props {
  children: React.ReactNode
}

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''

export default function AppProviders({ children }: Props) {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <LocationProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </LocationProvider>
    </StripeProvider>
  )
}
