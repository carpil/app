import { useBootstrapStore } from 'store/useBootstrapStore'

export const useBootstrap = () => {
  const {
    rideId,
    inRide,
    pendingReviews,
    isDriver,
    isLoading,
    lastFetched,
    pendingPayment,
  } = useBootstrapStore()

  return {
    rideId,
    inRide,
    pendingReviews,
    pendingPayment,
    isDriver,
    isLoading,
    lastFetched,
  }
}
