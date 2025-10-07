import Avatar from '@components/avatar'
import {
  ChatIcon,
  KebabIcon,
  LocationIcon,
  StarFilledIcon,
  UsersGroupIcon,
} from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { googleMapsTheme } from '@utils/constansts/google-maps-theme'
import { COSTA_RICA_REGION } from 'app/create-ride/ride-overview'
import { useLocalSearchParams } from 'expo-router'
import { useBootstrap } from 'hooks/useBootstrap'
import { useEffect, useRef, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Modalize } from 'react-native-modalize'
import { useStripe } from '@stripe/stripe-react-native'
import { completeRide, getRide } from 'services/api/rides'
import { createPaymentIntent } from 'services/api/payments'
import { useAuthStore } from 'store/useAuthStore'
import { formatCRC, convertCRCToCentimos } from '@utils/currency'
import { Ride } from '~types/ride'
import { User } from '~types/user'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export default function RideNavigationScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const { isDriver } = useBootstrap()
  const user = useAuthStore((state) => state.user)
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  const [ride, setRide] = useState<Ride | null>(null)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const mapRef = useRef<MapView>(null)
  const modalizeRef = useRef<Modalize>(null)

  const handleFinishRide = async () => {
    const message = await completeRide(rideId)
    console.log({ message })
  }

  const handlePayment = async () => {
    if (!ride || !user) return

    try {
      setIsPaymentProcessing(true)

      // Convertir colones a céntimos (Stripe requiere la unidad más pequeña)
      const amountInCentimos = convertCRCToCentimos(ride.price)

      // Create payment intent
      const paymentData = await createPaymentIntent({
        userId: user.id,
        rideId: ride.id,
        amount: amountInCentimos, // Céntimos de colón para Stripe
        description: `Pago por viaje de ${ride.origin?.name.primary} a ${ride.destination?.name.primary} - ${formatCRC(ride.price)}`,
      })

      if (!paymentData || !paymentData.clientSecret) {
        Alert.alert('Error', 'No se pudo crear el pago. Intenta nuevamente.')
        return
      }

      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Carpil',
        paymentIntentClientSecret: paymentData.clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: 'carpil://stripe-redirect',
      })

      if (initError) {
        Alert.alert('Error', initError.message)
        return
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet()

      if (presentError) {
        Alert.alert('Pago cancelado', presentError.message)
      } else {
        Alert.alert('Éxito', '¡Tu pago se ha procesado exitosamente!')
      }
    } catch (error) {
      console.error('Payment error:', error)
      Alert.alert('Error', 'Ocurrió un error al procesar el pago.')
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride == null) {
        return
      }
      setRide(ride)
    }
    fetchRide()
  }, [rideId])

  if (ride == null || ride.origin == null || ride.destination == null) {
    return null
  }

  const origin = ride.origin.location
  const destination = ride.destination.location

  const allUsers = [ride.driver, ...ride.passengers] as User[]

  const driverOffset = isDriver ? 0 : 50

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          userInterfaceStyle={'dark'}
          customMapStyle={googleMapsTheme}
          initialRegion={COSTA_RICA_REGION}
        >
          <MapViewDirections
            origin={{
              latitude: origin.lat!,
              longitude: origin.lng!,
            }}
            destination={{
              latitude: destination.lat!,
              longitude: destination.lng!,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
          />
          <Marker
            coordinate={{
              latitude: origin.lat!,
              longitude: origin.lng!,
            }}
          />
          <Marker
            coordinate={{
              latitude: destination.lat!,
              longitude: destination.lng!,
            }}
          />
          {/* Device location */}
          <Marker
            coordinate={{
              latitude: 9.9333,
              longitude: -84.0833,
            }}
          />
        </MapView>
        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 135 + driverOffset : 135}
          modalStyle={{
            backgroundColor: COLORS.dark_gray,
            padding: 15,
            paddingVertical: 15,
          }}
          modalTopOffset={
            Platform.OS === 'ios' ? 450 + driverOffset : 320 + driverOffset
          }
          avoidKeyboardLikeIOS={true}
        >
          <View>
            {/* Ride Details */}
            {/* Origin */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.primary} />
              <View>
                <Text style={styles.title}>{ride.origin.name.primary}</Text>
                <Text style={styles.subtitle}>
                  {ride.origin.name.secondary}
                </Text>
              </View>
            </View>
            <View style={{ marginVertical: 3, marginLeft: 3 }}>
              <KebabIcon color={COLORS.white} size={16} />
            </View>
            {/* Destination */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.secondary} />
              <View>
                <Text style={styles.title}>
                  {ride.destination.name.primary}
                </Text>
                <Text style={styles.subtitle}>
                  {ride.destination.name.secondary}
                </Text>
              </View>
            </View>
            {/* Passengers */}
            <View style={styles.passengerContainer}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <UsersGroupIcon color={COLORS.white} size={24} />
                <Text style={styles.passengerTitle}>Pasajeros en el viaje</Text>
              </View>
              <View style={styles.passengerList}>
                {allUsers.map((passenger) => (
                  <View
                    key={passenger.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: COLORS.gray_600,
                      borderRadius: 8,
                      padding: 8,
                      backgroundColor: COLORS.inactive_gray,
                    }}
                  >
                    <Avatar user={passenger} size={48} />
                    <View
                      style={{
                        gap: 4,
                      }}
                    >
                      <View>
                        <Text style={styles.passengerName}>
                          {passenger.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <StarFilledIcon color={COLORS.star_yellow} size={16} />
                        <Text style={styles.passengerRating}>4.5</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginLeft: 'auto',
                        padding: 8,
                        backgroundColor: COLORS.inactive_gray,
                        borderRadius: 8,
                      }}
                    >
                      <ChatIcon color={COLORS.white} size={16} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
            {isDriver && (
              <TouchableOpacity
                style={styles.finishRideButton}
                onPress={handleFinishRide}
              >
                <Text style={styles.finishRideText}>Completar viaje</Text>
              </TouchableOpacity>
            )}
            {!isDriver && (
              <>
                <View style={styles.paymentInfoContainer}>
                  <Text style={styles.paymentInfoLabel}>Total a pagar:</Text>
                  <Text style={styles.paymentInfoAmount}>
                    {formatCRC(ride.price)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    isPaymentProcessing && styles.paymentButtonDisabled,
                  ]}
                  onPress={handlePayment}
                  disabled={isPaymentProcessing}
                >
                  <Text style={styles.paymentButtonText}>
                    {isPaymentProcessing ? 'Procesando...' : 'Pagar viaje'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modalize>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 135,
    backgroundColor: COLORS.dark_gray,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    paddingVertical: 15,
  },
  userContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  titleContainer: {},
  locationContainer: {
    flexDirection: 'column',
  },
  arrow: {
    fontSize: 18,
    textAlign: 'center',
  },
  passengerContainer: {
    flexDirection: 'column',
    marginTop: 30,
    gap: 8,
  },
  passengerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  passengerList: {
    flexDirection: 'column',
    gap: 8,
  },
  passengerName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  passengerRating: {
    color: COLORS.white,
    fontSize: 12,
  },
  finishRideButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  finishRideText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    alignItems: 'center',
  },
  paymentInfoLabel: {
    color: COLORS.gray_400,
    fontSize: 14,
    marginBottom: 4,
  },
  paymentInfoAmount: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
