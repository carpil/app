import { Location } from '~types/location'

export interface PendingReview {
  id: string
  userId: string
  name: string
  profilePicture: string
  rideId: string
  role: 'driver' | 'passenger'
}

export interface RideInfo {
  rideId: string
  origin: Location
  destination: Location
  price: number
  completedAt: Date
}

export interface BootstrapResponse {
  rideId: string | null
  inRide: boolean
  pendingReviews: PendingReview[] | null
  pendingPayment: RideInfo | null
  isDriver: boolean
}
