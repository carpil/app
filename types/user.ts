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
  currentRideId?: string | null
  pendingReviewRideIds?: string[]
  lastUpdated?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface UserInfo {
  id: string
  name: string
  profilePicture: string
  role: 'driver' | 'passenger'
}
