import { User } from './user'

export type Ride = {
  id: string
  origin: string
  destination: string
  meetingPoint: string
  availableSeats: number
  price: number
  departureDate: Date
  passengers: User[]
  driver: User
  deletedAt: Date | null
  status?: 'active' | 'canceled' | 'completed'
  chatId: string
}
