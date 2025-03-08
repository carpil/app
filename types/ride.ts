import { Location } from '~types/location'
import { User } from '~types/user'

export type Ride = {
  id: string
  origin: Location | null
  destination: Location | null
  meetingPoint: Location | null
  availableSeats: number
  price: number
  departureDate: Date
  passengers: User[]
  driver: User
  deletedAt: Date | null
  status?: 'active' | 'canceled' | 'completed'
  chatId: string
}
