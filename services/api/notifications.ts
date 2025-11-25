import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'

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
    logger.error('Failed to set push notification token', {
      action: 'set_push_token_failed',
      metadata: {
        status: response.status,
      },
    })
    throw new Error('Failed to set push notification token')
  }

  logger.info('Push notification token set successfully', {
    action: 'set_push_token_success',
  })

  return response.json()
}
