import { useEffect, useState, useRef } from 'react'
import { subscribeToUser } from 'services/firestore/user'
import { useAuthStore } from 'store/useAuthStore'
import { User } from '~types/user'
import { useLogger } from './useLogger'
import { useBootstrapStore } from 'store/useBootstrapStore'
import { bootstrapMe } from 'services/api/user'
import { BootstrapResponse } from '~types/responses/bootstrap'

const refetchBootstrap = async (
  setBootstrap: (bootstrap: BootstrapResponse) => void,
) => {
  const newBootstrap = await bootstrapMe()
  if (newBootstrap) {
    setBootstrap(newBootstrap)
  }
}

const arraysEqual = (
  a: string[] | undefined,
  b: string[] | undefined,
): boolean => {
  if (!a && !b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  return a.every((val, index) => val === b[index])
}

export const useRealtimeUser = () => {
  const { user: storedUser, token } = useAuthStore()
  const [user, setUser] = useState<User | null>(storedUser)
  const { setBootstrap } = useBootstrapStore()
  const previousPendingReviewRideIdsRef = useRef<string[] | undefined>(
    undefined,
  )
  const previousPendingPaymentRideIdsRef = useRef<string[] | undefined>(
    undefined,
  )

  const logger = useLogger()

  useEffect(() => {
    if (!storedUser?.id || !token) {
      return
    }

    let unsubscribe: (() => void) | null = null

    const setupRealtimeUpdates = async () => {
      try {
        const initialBootstrap = await bootstrapMe()
        if (initialBootstrap) {
          setBootstrap(initialBootstrap)
          previousPendingReviewRideIdsRef.current =
            storedUser.pendingReviewRideIds
          previousPendingPaymentRideIdsRef.current =
            storedUser.pendingPaymentRideIds
        }

        unsubscribe = subscribeToUser(
          storedUser.id,
          async (updatedUser) => {
            if (updatedUser) {
              const pendingReviewRideIdsChanged = !arraysEqual(
                previousPendingReviewRideIdsRef.current,
                updatedUser.pendingReviewRideIds,
              )
              const pendingPaymentRideIdsChanged = !arraysEqual(
                previousPendingPaymentRideIdsRef.current,
                updatedUser.pendingPaymentRideIds,
              )

              setUser(updatedUser)

              if (pendingReviewRideIdsChanged || pendingPaymentRideIdsChanged) {
                await refetchBootstrap(setBootstrap)
                previousPendingReviewRideIdsRef.current =
                  updatedUser.pendingReviewRideIds
                previousPendingPaymentRideIdsRef.current =
                  updatedUser.pendingPaymentRideIds
              }
            }
          },
          (error) => {
            logger.exception(error, {
              action: 'user_listener_error',
              metadata: { userId: storedUser.id },
            })
          },
        )
      } catch (error) {
        logger.exception(error, {
          action: 'user_fetch_error',
          metadata: { userId: storedUser.id },
        })
      }
    }

    setupRealtimeUpdates()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedUser?.id, token, logger, setBootstrap])

  return user ?? null
}
