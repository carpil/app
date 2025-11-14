import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { RideRequestsResponse } from '~types/responses/ride-request'
import { CreateRideRequestInput, RideRequest } from '~types/ride-request'

export const getRideRequests = async () => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ride-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    return []
  }
  const data = (await response.json()) as RideRequestsResponse
  return data
}

export const createRideRequest = async (request: CreateRideRequestInput) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ride-requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    console.log('🚫 Error creating ride request:', response.status)
    return null
  }
  const data = (await response.json()) as RideRequest

  console.log('🚀 Ride request created:', data)
  return data
}
