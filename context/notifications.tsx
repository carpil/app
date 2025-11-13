import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react'
import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from 'services/push-notifications/register-push-notifications'
import { setPushNotificationToken } from 'services/api/notifications'
import { handleNotificationNavigation } from 'services/push-notifications/handle-notification-navigation'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

interface NotificationContextType {
  expoPushToken: string | null
  notification: Notifications.Notification | null
  error: Error | null
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    )
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        await setPushNotificationToken(token)
        setExpoPushToken(token)
      })
      .catch((error) => setError(error))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationData = response.notification.request.content.data

        handleNotificationNavigation(notificationData)
      })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        )
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
