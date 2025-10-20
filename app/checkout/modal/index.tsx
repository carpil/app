import { useRef, useState, useEffect } from 'react'
import { COLORS } from '@utils/constansts/colors'
import {
  Platform,
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Modalize } from 'react-native-modalize'
import { RideInfo } from '~types/responses/bootstrap'
import { formatCRC } from '@utils/currency'
import { LocationIcon } from '@components/icons'
import { router } from 'expo-router'
import { useDebitCard } from '../[rideId]/use-debit-card'
import { useAuthStore } from 'store/useAuthStore'

enum PaymentMethod {
  SINPE_MOVIL = 'sinpe_movil',
  DEBIT_CARD = 'debit_card',
}

interface CheckoutModalProps {
  pendingPayment: RideInfo
}

export default function CheckoutModal({ pendingPayment }: CheckoutModalProps) {
  const modalizeRef = useRef<Modalize>(null)
  const [canDismiss] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const user = useAuthStore((state) => state.user)
  const { isPaymentProcessing, handlePayment } = useDebitCard({
    ride: pendingPayment,
    user,
  })

  const { origin, destination, price } = pendingPayment

  useEffect(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])

  const handlePay = async () => {
    if (paymentMethod === PaymentMethod.SINPE_MOVIL) {
      router.push(`/checkout/${pendingPayment.rideId}/sinpe-movil`)
    } else if (paymentMethod === PaymentMethod.DEBIT_CARD) {
      try {
        const result = await handlePayment()
        if (result instanceof Error) {
          Alert.alert('Error', result.message)
          return
        }
        router.replace('/(tabs)')
      } catch (error) {
        console.error('Error processing payment:', error)
        Alert.alert('Error', 'Ocurrió un error al procesar el pago.')
      }
    }
  }

  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={{
        backgroundColor: COLORS.dark_gray,
      }}
      modalTopOffset={Platform.OS === 'ios' ? 100 : 50}
      avoidKeyboardLikeIOS={true}
      adjustToContentHeight={true}
      disableScrollIfPossible={false}
      closeOnOverlayTap={canDismiss}
      closeSnapPointStraightEnabled={canDismiss}
      onClosed={() => {
        if (!canDismiss && modalizeRef.current) {
          modalizeRef.current.open()
        }
      }}
    >
      <View
        style={{
          ...styles.container,
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 5,
          }}
        >
          ¡Tienes un pago pendiente!
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <LocationIcon color={COLORS.primary} />
          <View>
            <Text style={styles.locationTitle}>{origin.name.primary}</Text>
            <Text style={styles.locationSubtitle}>{origin.name.secondary}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <LocationIcon color={COLORS.secondary} />
          <View>
            <Text style={styles.locationTitle}>{destination.name.primary}</Text>
            <Text style={styles.locationSubtitle}>
              {destination.name.secondary}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Seleccione una forma de pago</Text>
          <View style={styles.paymentMethodsContainer}>
            <Pressable
              style={[
                styles.button,
                paymentMethod === PaymentMethod.SINPE_MOVIL &&
                  styles.buttonActive,
              ]}
              onPress={() => setPaymentMethod(PaymentMethod.SINPE_MOVIL)}
            >
              <Text
                style={[
                  styles.buttonText,
                  paymentMethod === PaymentMethod.SINPE_MOVIL &&
                    styles.buttonTextActive,
                ]}
              >
                SINPE Móvil
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                paymentMethod === PaymentMethod.DEBIT_CARD &&
                  styles.buttonActive,
              ]}
              onPress={() => setPaymentMethod(PaymentMethod.DEBIT_CARD)}
            >
              <Text
                style={[
                  styles.buttonText,
                  paymentMethod === PaymentMethod.DEBIT_CARD &&
                    styles.buttonTextActive,
                ]}
              >
                Tarjeta de débito / crédito
              </Text>
            </Pressable>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            (!paymentMethod || isPaymentProcessing) && styles.payButtonDisabled,
          ]}
          disabled={!paymentMethod || isPaymentProcessing}
          onPress={handlePay}
        >
          <Text
            style={[
              styles.payButtonText,
              (!paymentMethod || isPaymentProcessing) &&
                styles.payButtonTextDisabled,
            ]}
          >
            {isPaymentProcessing
              ? 'Procesando...'
              : `Pagar ${formatCRC(price)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    gap: 20,
    paddingTop: 20,
    backgroundColor: COLORS.dark_gray,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
  locationTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationSubtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentMethodsContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
  },
  buttonText: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  buttonActive: {
    borderColor: COLORS.secondary,
    borderWidth: 2,
  },
  buttonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButtonTextDisabled: {
    color: COLORS.gray_400,
  },
})
