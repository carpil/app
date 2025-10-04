import { useEffect, useRef } from 'react'
import { bootstrapMe } from 'services/api/user'
import { subscribeToUserDocument } from 'services/firestore/user-state'
import { useBootstrapStore } from 'store/useBootstrapStore'
import { useAuthStore } from 'store/useAuthStore'
import { User } from '~types/user'

export const useRealtimeBootstrap = () => {
  const { user, token } = useAuthStore()
  const { setBootstrap, setLoading, clearBootstrap, isLoading, rideId } =
    useBootstrapStore()
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const fetchBootstrap = async () => {
    if (!user?.id || !token) return

    setLoading(true)
    try {
      const bootstrap = await bootstrapMe()
      if (bootstrap) {
        setBootstrap(bootstrap)
      }
    } catch (error) {
      console.error('Failed to fetch bootstrap:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStateChange = async (userData: User) => {
    const currentRideId = userData.currentRideId
    const pendingReviewRideIds = userData.pendingReviewRideIds

    const shouldRefetch =
      currentRideId !== rideId ||
      (pendingReviewRideIds && pendingReviewRideIds.length > 0)

    if (shouldRefetch) {
      await fetchBootstrap()
    }
  }

  const handleError = (error: Error) => {
    console.error('User document listener error:', error)
    setLoading(false)
  }

  useEffect(() => {
    if (!user?.id || !token) {
      clearBootstrap()
      return
    }

    fetchBootstrap()

    unsubscribeRef.current = subscribeToUserDocument(
      user.id,
      handleUserStateChange,
      handleError,
    )

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [user?.id, token])

  return {
    isLoading,
  }
}
