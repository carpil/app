import { User } from './user'

export interface RideRequest {
  id: string
  origin: string
  destination: string
  departureDate: Date
  spaces: number
  creator: User
  deletedAt: Date | null
  status: 'active' | 'canceled'
}
