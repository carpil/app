import { UserInfo } from '~types/user'
import { Location } from '~types/location'

export enum RideRequestStatus {
  Active = 'active',
  Canceled = 'canceled',
  Expired = 'expired',
}

export interface RideRequest {
  id: string
  origin: Location
  destination: Location
  departureDate: Date
  creator: UserInfo
  status: RideRequestStatus
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateRideRequestInput {
  origin: Location
  destination: Location
  departureDate: Date
}
