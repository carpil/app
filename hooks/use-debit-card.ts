import { useState } from 'react'
import { StyledAlert } from '@components/styled-alert'
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native'

import { convertCRCToCentimos, formatCRC } from '@utils/currency'
import { createPaymentIntent } from 'services/api/payments'
import { Ride } from '~types/ride'
import { RideInfo } from '~types/responses/bootstrap'
import { User } from '~types/user'

interface UseDebitCardProps {
  ride: Ride | RideInfo | null
  user: User | null
}

export const useDebitCard = ({ ride, user }: UseDebitCardProps) => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  const handlePayment = async () => {
    if (!ride || !user) return

    try {
      setIsPaymentProcessing(true)

      // Convertir colones a céntimos (Stripe requiere la unidad más pequeña)
      const amountInCentimos = convertCRCToCentimos(ride.price)

      // Handle both Ride (has 'id') and RideInfo (has 'rideId')
      const rideId = 'rideId' in ride ? ride.rideId : ride.id

      // Create payment intent
      const paymentData = await createPaymentIntent({
        userId: user.id,
        rideId: rideId,
        amount: amountInCentimos, // Céntimos de colón para Stripe
        description: `Pago por viaje de ${ride.origin?.name.primary} a ${ride.destination?.name.primary} - ${formatCRC(ride.price)}`,
      })

      if (!paymentData || !paymentData.clientSecret) {
        StyledAlert.alert('Error', 'No se pudo crear el pago. Intenta nuevamente.')
        return new Error('No se pudo crear el pago. Intenta nuevamente.')
      }

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Carpil',
        paymentIntentClientSecret: paymentData.clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: 'carpil://stripe-redirect',
      })

      if (initError) {
        StyledAlert.alert('Error', initError.message)
        return new Error(initError.message)
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet()

      if (presentError) {
        StyledAlert.alert('Pago cancelado', presentError.message)
        return new Error(presentError.message)
      } else {
        StyledAlert.alert(
          '¡Pago completado!',
          'Tu pago ha sido procesado exitosamente',
        )
        return null
      }
    } catch (error) {
      console.error('Payment error:', error)
      StyledAlert.alert('Error', 'Ocurrió un error al procesar el pago.')
      return new Error('Ocurrió un error al procesar el pago.')
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  return {
    isPaymentProcessing,
    handlePayment,
  }
}
