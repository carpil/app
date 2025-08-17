import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'

export const setPushNotificationToken = async (token: string) => {
  const authToken = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/notifications/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ pushToken: token }),
  })
  if (!response.ok) {
    throw new Error('Failed to set push notification token')
  }
  return response.json()
}
