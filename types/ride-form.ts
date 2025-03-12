import { Location } from '~types/location'

export interface RideFormData {
  origin: Location
  destination: Location
  meetingPoint: Location
  availableSeats: number
  price: number
  departureDate: string
}
