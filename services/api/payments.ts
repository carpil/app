import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'

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

interface CompleteSinpePaymentRequest {
  userId: string
  rideId: string
  amount: number
  description: string
  paymentMethod: 'sinpe'
  attachmentUrl: string
}

interface CompleteSinpePaymentResponse {
  success: boolean
  message: string
  paymentId?: string
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
    logger.error('Failed to create payment intent', {
      action: 'create_payment_intent_failed',
      metadata: {
        status: response.status,
        error,
        rideId: request.rideId,
        amount: request.amount,
      },
    })
    return null
  }

  const data = (await response.json()) as CreatePaymentIntentResponse

  logger.info('Payment intent created successfully', {
    action: 'create_payment_intent_success',
    metadata: {
      rideId: request.rideId,
      amount: request.amount,
    },
  })

  return data
}

export const completeSinpePayment = async (
  request: CompleteSinpePaymentRequest,
) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/payments/complete-sinpe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    logger.error('Failed to complete SINPE payment', {
      action: 'complete_sinpe_payment_failed',
      metadata: {
        status: response.status,
        error,
        rideId: request.rideId,
        amount: request.amount,
      },
    })
    return null
  }

  const data = (await response.json()) as CompleteSinpePaymentResponse

  logger.info('SINPE payment completed successfully', {
    action: 'complete_sinpe_payment_success',
    metadata: {
      rideId: request.rideId,
      amount: request.amount,
      paymentId: data.paymentId,
    },
  })

  return data
}
