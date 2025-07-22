import { User } from '~types/user'
import { Ride } from '~types/ride'
import { Message } from '~types/message'

export interface ChatResponse {
  id: string
  participants: User[]
  owner: User
  rideId?: string
  ride?: Ride | null
  lastMessage?: Message | null
  createdAt: Date
  updatedAt?: Date
}
