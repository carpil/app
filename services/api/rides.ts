import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { updateUserState } from 'services/firestore/user-state'
import { CreateRideRequest } from '~types/requests/ride'
import { DefaultResponse } from '~types/responses/default'
import { RideResponse, RidesResponse } from '~types/responses/rides'

// Helper function to update Firebase state after API calls
const updateFirebaseState = async (state: {
  inRide: boolean
  rideId: string | null
  isDriver: boolean
}) => {
  const { user } = useAuthStore.getState()
  if (user) {
    await updateUserState(user.id, {
      ...state,
      rideId: state.rideId || undefined,
    })
  }
}

export const getRides = async () => {
  const response = await fetch(`${API_URL}/rides/drivers`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    return []
  }
  const data = (await response.json()) as RidesResponse
  const { rides } = data

  return rides
}

export const getRide = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides/drivers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
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
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      departureDate: request.departureDate.toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error: JSON.stringify(error) })
    return null
  }
  const data = (await response.json()) as RideResponse
  const { ride } = data

  return ride
}

export const joinRide = async (id: string) => {
  const token = useAuthStore.getState().token
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

export const unjoinRide = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides/${id}/un-join`, {
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

export const startRide = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides/${id}/start`, {
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

  // Update Firebase user state when driver starts the ride
  if (message) {
    await updateFirebaseState({
      inRide: true,
      rideId: id,
      isDriver: true,
    })
  }

  return message
}

export const completeRide = async (id: string) => {
  const token = useAuthStore.getState().token

  const response = await fetch(`${API_URL}/rides/${id}/complete`, {
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
