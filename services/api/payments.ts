import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'

interface CreatePaymentIntentRequest {
  userId: string
  rideId: string
  amount: number
  description: string
}

interface CreatePaymentIntentResponse {
  success: boolean
  clientSecret: string
  message: string
}

export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest,
) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/payments/create-intent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error: JSON.stringify(error) })
    return null
  }

  const data = (await response.json()) as CreatePaymentIntentResponse
  return data
}
