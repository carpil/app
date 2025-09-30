export interface PendingReview {
  id: string
  name: string
  profilePicture: string
  role: 'driver' | 'passenger'
}

export interface BootstrapResponse {
  rideId: string
  inRide: boolean
  pendingReviews: PendingReview[]
  isDriver: boolean
}
