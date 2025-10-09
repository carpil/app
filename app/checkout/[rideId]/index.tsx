import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import SafeScreen from '@components/safe-screen'
import { useEffect, useState } from 'react'
import { getRide } from 'services/api/rides'
import { Ride } from '~types/ride'
import { COLORS } from '@utils/constansts/colors'
import AvatarCard from './components/avtar-card'
import { ScrollView } from 'react-native-gesture-handler'
import AllPassengersCard from './components/all-passengers-card'
import { formatCRC } from '@utils/currency'

enum PaymentMethod {
  SINPE_MOVIL = 'sinpe_movil',
  DEBIT_CARD = 'debit_card',
}

export default function Checkout() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride) {
        setRide(ride)
      }
    }
    fetchRide()
  }, [rideId])

  if (!ride) {
    return (
      <SafeScreen>
        <Text>Cargando...</Text>
      </SafeScreen>
    )
  }

  const priceFormatted = formatCRC(ride.price)
  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.mapContainer}>
          <Text>Map</Text>
          <Text>{ride?.origin?.name.primary}</Text>
          <Text>{ride?.destination?.name.primary}</Text>
        </View>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 15,
          }}
        >
          ¡Tu viaje ha sido completado!
        </Text>
        <Text
          style={{
            color: COLORS.gray_400,
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 15,
            marginTop: 2,
          }}
        >
          Gracias por viajar con Carpil.
        </Text>
        <AvatarCard user={ride?.driver} role="driver" />
        <AllPassengersCard passengers={ride?.passengers} />

        <View
          style={{
            marginTop: 40,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Seleccione una forma de pago
          </Text>
          <View
            style={{
              flexDirection: 'column',
              gap: 8,
              marginTop: 10,
            }}
          >
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
            styles.finishRideButton,
            !paymentMethod && styles.finishRideButtonDisabled,
          ]}
          disabled={!paymentMethod}
          onPress={() => {
            if (!paymentMethod) return
            if (paymentMethod === PaymentMethod.SINPE_MOVIL) {
              router.push(`/checkout/${rideId}/sinpe-movil`)
            } else if (paymentMethod === PaymentMethod.DEBIT_CARD) {
              router.push(`/checkout/${rideId}/debit-card`)
            }
          }}
        >
          <Text
            style={[
              styles.finishRideText,
              !paymentMethod && styles.finishRideTextDisabled,
            ]}
          >
            {`Pagar ${priceFormatted}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: COLORS.inactive_gray,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    padding: 10,
    borderRadius: 10,
    height: 200,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passengerName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
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
  finishRideButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  finishRideButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  finishRideText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishRideTextDisabled: {
    color: COLORS.gray_400,
  },
})
