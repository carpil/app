import { Location } from '~types/location'

export interface CreateRideRequest {
  origin: Location
  destination: Location
  meetingPoint: Location
  availableSeats: number
  price: number
  departureDate: Date
}
