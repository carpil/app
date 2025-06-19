import { NotificationProvider } from '@context/notifications'
import LocationProvider from '@context/select-location'

interface Props {
  children: React.ReactNode
}
export default function AppProviders({ children }: Props) {
  return (
    <LocationProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </LocationProvider>
  )
}
