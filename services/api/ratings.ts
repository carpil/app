import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { Rating } from '~types/rating'
import { logger } from '@utils/logs'

export const createRating = async (rating: Rating) => {
  const token = useAuthStore.getState().token

  if (!token) {
    logger.error('No token available for rating creation', {
      action: 'create_rating_no_token',
      metadata: {
        targetUserId: rating.targetUserId,
      },
    })
    return null
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rating),
  }

  const response = await fetch(`${API_URL}/ratings`, requestOptions)

  if (!response.ok) {
    logger.error('Failed to create rating', {
      action: 'create_rating_failed',
      metadata: {
        status: response.status,
        targetUserId: rating.targetUserId,
        rating: rating.rating,
      },
    })
    return null
  }

  const data = await response.json()

  logger.info('Rating created successfully', {
    action: 'create_rating_success',
    metadata: {
      targetUserId: rating.targetUserId,
      rating: rating.rating,
      rideId: rating.rideId,
    },
  })

  return data
}
