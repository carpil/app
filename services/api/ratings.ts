import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { Rating } from '~types/rating'

export const createRating = async (rating: Rating) => {
  console.log('rating', rating)
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rating),
  })

  const responseData = await response.json()
  console.log({
    status: response.status,
    response: JSON.stringify(responseData),
  })
  if (!response.ok) {
    return null
  }

  const data = await response.json()

  return data
}
