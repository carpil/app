import { API_KEY, API_URL } from '@utils/constansts/api'
import { CreateRideRequest } from '~types/requests/ride'
import { DefaultResponse } from '~types/responses/default'
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

export const joinRide = async (id: string) => {
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwODA2N2Q4M2YwY2Y5YzcxNjQyNjUwYzUyMWQ0ZWZhNWI2YTNlMDkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSm9zZSBSb2RvbGZvIFJvamFzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xobzVkUEJwQ0xwZzY3WExENHJRdWdFaUliRllBUE55RVNBWjhjNVNEaHV2NWhqXzZNPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2NhcnBpbC1lZjZiOSIsImF1ZCI6ImNhcnBpbC1lZjZiOSIsImF1dGhfdGltZSI6MTc0MTgwMjE2MCwidXNlcl9pZCI6Inc5S1J2N2dtd3JhQU5ERmRDRW5yd21vbEZRQzMiLCJzdWIiOiJ3OUtSdjdnbXdyYUFOREZkQ0Vucndtb2xGUUMzIiwiaWF0IjoxNzQxODAyMTYwLCJleHAiOjE3NDE4MDU3NjAsImVtYWlsIjoianJvZG9sZm8xMDEwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA1NDgyNzg2NjE0NDc5MDc0Mjg0Il0sImVtYWlsIjpbImpyb2RvbGZvMTAxMEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.ACu-qKXhG0oCchbuSK23ZxEUMbhD5ZHQ5YiHmcFF896OT2CBv6h1p9RaW3dm1j6aZ5qw9tCmaOk49v2p_jg9WINg2PkpABrAqy65eIXR9LaWBPX9rKivU3Ct5B-7KkFKBT73scFjOdPlZFbDUGbR-N4JW6QZoIKXs7ctViS9512ZErMf81kH_sl6byTlN7DSZDdcfLTVrE3FUsw_TNjGuNLhqn9okxLJK682PXvD4PXU7fxOWhPOJpW8mHajJVNI5zAp0851diVcyieN1Lh0CkR7FLRgML_dZTNE4a_TMV3IC8qHPJh3FIFjj87DCMVLlYWvTfJrP4HAbNzyKwA7_A'

  const response = await fetch(`${API_URL}/rides/${id}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  return message
}
