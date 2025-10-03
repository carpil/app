import { useBootstrapStore } from 'store/useBootstrapStore'

export const useBootstrap = () => {
  const { rideId, inRide, pendingReviews, isDriver, isLoading, lastFetched } =
    useBootstrapStore()

  return {
    rideId,
    inRide,
    pendingReviews,
    isDriver,
    isLoading,
    lastFetched,
  }
}
