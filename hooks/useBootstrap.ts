import { useBootstrapStore } from 'store/useBootstrapStore'
import { useRealtimeUser } from './useRealtimeUser'

export const useBootstrap = () => {
  const userRealTime = useRealtimeUser()
  const {
    pendingReviews: storePendingReviews,
    isDriver,
    isLoading,
    lastFetched,
    pendingPayment: storePendingPayment,
  } = useBootstrapStore()

  const inRide = userRealTime?.inRide ?? false
  const rideId = userRealTime?.currentRideId ?? null

  return {
    rideId,
    inRide,
    pendingReviews: storePendingReviews,
    pendingPayment: storePendingPayment,
    isDriver,
    isLoading,
    lastFetched,
  }
}
