export interface User {
  id: string
  name: string
  profilePicture: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profileCompleted?: boolean
  pushToken?: string[]
  averageRating?: number
  inRide?: {
    active: boolean
    rideId?: string
    rideStartedAt?: Date
    pendingToReview?: boolean
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface UserInfo {
  id: string
  name: string
  profilePicture: string
  role: 'driver' | 'passenger'
}
