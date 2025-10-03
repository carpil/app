import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { Rating } from '~types/rating'
import { debugApiRequest, debugApiResponse } from '@utils/debug-api'

export const createRating = async (rating: Rating) => {
  console.log('📝 Creating rating for user:', rating.targetUserId)

  const token = useAuthStore.getState().token

  if (!token) {
    console.error('❌ No token available for rating creation')
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

  debugApiRequest(`${API_URL}/ratings`, requestOptions, 'Create Rating')

  const response = await fetch(`${API_URL}/ratings`, requestOptions)

  await debugApiResponse(response, 'Create Rating')

  if (!response.ok) {
    console.error('❌ Failed to create rating:', response.status)
    return null
  }

  const data = await response.json()
  console.log('✅ Rating created successfully:', data)

  return data
}
