import { useEffect, useRef } from 'react'
import { bootstrapMe } from 'services/api/user'
import { useBootstrapStore } from 'store/useBootstrapStore'
import { useAuthStore } from 'store/useAuthStore'
import { subscribeToUserBootstrap } from 'services/firestore/user-state'
import { logger } from '@utils/logs'

export const useRealtimeBootstrap = () => {
  const { user, token } = useAuthStore()
  const {
    setBootstrap,
    setLoading,
    clearBootstrap,
    updateBootstrap,
    isLoading,
  } = useBootstrapStore()
  const previousPendingReviewRideIdsRef = useRef<string[]>([])

  useEffect(() => {
    if (!user?.id || !token) {
      clearBootstrap()
      return
    }

    let unsubscribe: (() => void) | null = null

    const setupRealtimeUpdates = async () => {
      try {
        setLoading(true)

        const initialBootstrap = await bootstrapMe()
        if (initialBootstrap) {
          setBootstrap(initialBootstrap)
          previousPendingReviewRideIdsRef.current =
            initialBootstrap.pendingReviews?.map((r) => r.id) || []
        }

        unsubscribe = subscribeToUserBootstrap(
          user.id,
          (bootstrapData) => {
            if (bootstrapData) {
              updateBootstrap({
                rideId: bootstrapData.rideId,
                inRide: bootstrapData.inRide,
                isDriver: bootstrapData.isDriver,
              })

              const currentPendingReviewRideIds =
                bootstrapData.pendingReviewRideIds
              const previousPendingReviewRideIds =
                previousPendingReviewRideIdsRef.current

              const hasPendingReviewsChanged =
                currentPendingReviewRideIds.length !==
                previousPendingReviewRideIds.length ||
                currentPendingReviewRideIds.some(
                  (id, index) => id !== previousPendingReviewRideIds[index],
                )

              if (hasPendingReviewsChanged) {
                previousPendingReviewRideIdsRef.current =
                  currentPendingReviewRideIds
                bootstrapMe()
                  .then((fullBootstrap) => {
                    if (fullBootstrap) {
                      setBootstrap(fullBootstrap)
                    }
                  })
                  .catch((error) => {
                    logger.exception(error, {
                      action:
                        'fetch_bootstrap_on_pending_reviews_change_failed',
                      metadata: { userId: user.id },
                    })
                  })
              }
            }
            setLoading(false)
          },
          (error) => {
            logger.exception(error, {
              action: 'user_bootstrap_listener_error',
              metadata: { userId: user.id },
            })
            setLoading(false)
          },
        )
      } catch (error) {
        logger.exception(error, {
          action: 'fetch_bootstrap_failed',
          metadata: { userId: user?.id },
        })
        setLoading(false)
      }
    }

    setupRealtimeUpdates()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [
    user?.id,
    token,
    setBootstrap,
    setLoading,
    clearBootstrap,
    updateBootstrap,
  ])

  return { isLoading }
}
