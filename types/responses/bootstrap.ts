export interface PendingReview {
  id: string
  name: string
  profilePicture: string
  role: 'driver' | 'passenger'
}

export interface BootstrapResponse {
  rideId: string | null
  inRide: boolean
  pendingReviews: PendingReview[]
  isDriver: boolean
}
