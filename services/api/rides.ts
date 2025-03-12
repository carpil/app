import { API_KEY, API_URL } from '@utils/constansts/api'
import { CreateRideRequest } from '~types/requests/ride'
import { RideResponse, RidesResponse } from '~types/responses/rides'

export const getRides = async () => {
  const response = await fetch(`${API_URL}/rides/drivers`)
  if (!response.ok) {
    return []
  }
  const data = (await response.json()) as RidesResponse
  const { rides } = data

  return rides
}

export const getRide = async (id: string) => {
  const response = await fetch(`${API_URL}/rides/drivers/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })
  if (!response.ok) {
    return null
  }
  const data = (await response.json()) as RideResponse
  const { ride } = data

  return ride
}

export const createRide = async (request: CreateRideRequest) => {
  const response = await fetch(`${API_URL}/rides`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      departureDate: request.departureDate.toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error })
    return null
  }
  const data = (await response.json()) as RideResponse
  const { ride } = data

  return ride
}
