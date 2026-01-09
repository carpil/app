import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import {
  RideRequestResponse,
  RideRequestsResponse,
} from '~types/responses/ride-request'
import { CreateRideRequestInput, RideRequest } from '~types/ride-request'
import { logger } from '@utils/logs'

export const getRideRequests = async () => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ride-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    logger.error('Failed to fetch ride requests', {
      action: 'get_ride_requests_failed',
      metadata: {
        status: response.status,
      },
    })
    throw new Error('Failed to fetch ride requests')
  }
  const data = (await response.json()) as RideRequestsResponse

  logger.info('Ride requests fetched successfully', {
    action: 'get_ride_requests_success',
    metadata: {
      count: data.rideRequests?.length || 0,
    },
  })

  return data
}

export const getRideRequestById = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ride-requests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    logger.error('Failed to fetch ride request', {
      action: 'get_ride_request_failed',
      metadata: {
        status: response.status,
        rideRequestId: id,
      },
    })
    throw new Error('Failed to fetch ride request')
  }
  const data = (await response.json()) as RideRequestResponse

  logger.info('Ride request fetched successfully', {
    action: 'get_ride_request_success',
    metadata: {
      rideRequestId: id,
    },
  })

  return data.rideRequest
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
    logger.error('Failed to create ride request', {
      action: 'create_ride_request_failed',
      metadata: {
        status: response.status,
        origin: request.origin,
        destination: request.destination,
      },
    })
    return null
  }
  const data = (await response.json()) as RideRequest

  logger.info('Ride request created successfully', {
    action: 'create_ride_request_success',
    metadata: {
      rideRequestId: data.id,
      origin: request.origin,
      destination: request.destination,
    },
  })

  return data
}

export const deleteRideRequest = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ride-requests/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    logger.error('Failed to delete ride request', {
      action: 'delete_ride_request_failed',
      metadata: {
        status: response.status,
        error,
        rideRequestId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as { message: string }
  const { message } = data

  logger.info('Ride request deleted successfully', {
    action: 'delete_ride_request_success',
    metadata: {
      rideRequestId: id,
    },
  })

  return message
}
