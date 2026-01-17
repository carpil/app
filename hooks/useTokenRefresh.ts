import { useEffect } from 'react'
import { getAuth, onIdTokenChanged } from '@react-native-firebase/auth'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'

export const useTokenRefresh = () => {
  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) return

      try {
        const token = await user.getIdToken(false)

        if (token) {
          useAuthStore.getState().setToken(token)

          logger.debug('Token updated via listener', {
            action: 'token_refresh_success',
            metadata: { userId: user.uid },
          })
        }
      } catch (error) {
        logger.error('Error updating token from listener', {
          action: 'token_refresh_error',
          metadata: { error },
        })
      }
    })

    return () => unsubscribe()
  }, [])
}
