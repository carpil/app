import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { updateUserState } from 'services/firestore/user-state'
import { CreateRideRequest } from '~types/requests/ride'
import { DefaultResponse } from '~types/responses/default'
import { RideResponse, RidesResponse } from '~types/responses/rides'
import { logger } from '@utils/logs'

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
    logger.error('Failed to fetch rides', {
      action: 'get_rides_failed',
      metadata: {
        status: response.status,
      },
    })
    return []
  }
  const data = (await response.json()) as RidesResponse
  const { rides } = data

  logger.info('Rides fetched successfully', {
    action: 'get_rides_success',
    metadata: {
      count: rides.length,
    },
  })

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
    logger.error('Failed to fetch ride', {
      action: 'get_ride_failed',
      metadata: {
        status: response.status,
        rideId: id,
      },
    })
    return null
  }
  const data = (await response.json()) as RideResponse
  const { ride } = data

  logger.info('Ride fetched successfully', {
    action: 'get_ride_success',
    metadata: {
      rideId: id,
    },
  })

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
    logger.error('Failed to create ride', {
      action: 'create_ride_failed',
      metadata: {
        status: response.status,
        error,
        origin: request.origin,
        destination: request.destination,
      },
    })
    return null
  }
  const data = (await response.json()) as RideResponse
  const { ride } = data

  logger.info('Ride created successfully', {
    action: 'create_ride_success',
    metadata: {
      rideId: ride.id,
      origin: request.origin,
      destination: request.destination,
      passengers: request.availableSeats,
    },
  })

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
    logger.error('Failed to join ride', {
      action: 'join_ride_failed',
      metadata: {
        status: response.status,
        error,
        rideId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  logger.info('Joined ride successfully', {
    action: 'join_ride_success',
    metadata: {
      rideId: id,
    },
  })

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
    logger.error('Failed to start ride', {
      action: 'start_ride_failed',
      metadata: {
        status: response.status,
        error,
        rideId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  if (message) {
    await updateFirebaseState({
      inRide: true,
      rideId: id,
      isDriver: true,
    })

    logger.info('Ride started successfully', {
      action: 'start_ride_success',
      metadata: {
        rideId: id,
      },
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
    logger.error('Failed to complete ride', {
      action: 'complete_ride_failed',
      metadata: {
        status: response.status,
        error,
        rideId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  logger.info('Ride completed successfully', {
    action: 'complete_ride_success',
    metadata: {
      rideId: id,
    },
  })

  return message
}

export const leaveRide = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides/${id}/leave`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    logger.error('Failed to leave ride', {
      action: 'leave_ride_failed',
      metadata: {
        status: response.status,
        error,
        rideId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  logger.info('Left ride successfully', {
    action: 'leave_ride_success',
    metadata: {
      rideId: id,
    },
  })

  return message
}

export const deleteRide = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/rides/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    logger.error('Failed to delete ride', {
      action: 'delete_ride_failed',
      metadata: {
        status: response.status,
        error,
        rideId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as DefaultResponse
  const { message } = data

  logger.info('Ride deleted successfully', {
    action: 'delete_ride_success',
    metadata: {
      rideId: id,
    },
  })

  return message
}
