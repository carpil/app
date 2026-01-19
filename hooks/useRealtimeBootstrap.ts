import { useEffect } from 'react'
import { bootstrapMe } from 'services/api/user'
import { useBootstrapStore } from 'store/useBootstrapStore'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'

export const useRealtimeBootstrap = () => {
  const { user, token } = useAuthStore()
  const { setBootstrap, setLoading, clearBootstrap, isLoading } =
    useBootstrapStore()

  useEffect(() => {
    if (!user?.id || !token) {
      clearBootstrap()
      return
    }

    const fetchBootstrap = async () => {
      setLoading(true)
      try {
        const bootstrap = await bootstrapMe()
        if (bootstrap) {
          setBootstrap(bootstrap)
        }
      } catch (error) {
        logger.exception(error, {
          action: 'fetch_bootstrap_failed',
          metadata: { userId: user?.id },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBootstrap()
  }, [user?.id, token, setBootstrap, setLoading, clearBootstrap])

  return { isLoading }
}
