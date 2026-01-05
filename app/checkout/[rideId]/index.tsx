import { Text, View, StyleSheet, Pressable, Alert } from 'react-native'
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
import { useDebitCard } from 'hooks/use-debit-card'
import { useAuthStore } from 'store/useAuthStore'
import Avatar from '@components/avatar'
import StarRating from 'app/ratings/star-rating'
import { RatingComponentProps } from 'app/ratings/passengers-rating'
import { createRating } from 'services/api/ratings'
import ActionButton from '@components/design-system/buttons/action-button'
import MapImage from '@components/design-system/maps/image'
import { useLogger } from 'hooks/useLogger'
import { bootstrapMe } from 'services/api/user'
import { useBootstrapStore } from 'store/useBootstrapStore'
import CloseButton from '@components/design-system/buttons/close-button'
import { Stack } from 'expo-router'
import Screen from '@components/screen'

enum PaymentMethod {
  SINPE_MOVIL = 'sinpe_movil',
  DEBIT_CARD = 'debit_card',
}

export default function Checkout() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()
  const logger = useLogger('CheckoutScreen')
  const [ride, setRide] = useState<Ride | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [ratings, setRatings] = useState<RatingComponentProps[]>([])
  const [isCompleting, setIsCompleting] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setBootstrap = useBootstrapStore((state) => state.setBootstrap)

  const { isPaymentProcessing, handlePayment } = useDebitCard({
    ride,
    user,
  })

  const handlePay = async () => {
    if (!paymentMethod) return
    if (paymentMethod === PaymentMethod.SINPE_MOVIL) {
      router.push(`/checkout/${rideId}/sinpe-movil`)
    } else if (paymentMethod === PaymentMethod.DEBIT_CARD) {
      const result = await handlePayment()
      if (result instanceof Error) {
        Alert.alert('Error', result.message)
        return
      }
      router.replace('/(tabs)')
    }
  }

  const handleCompleteRating = async () => {
    if (isCompleting) {
      return
    }

    setIsCompleting(true)

    try {
      logger.info('Starting ride completion', {
        action: 'finish_ride_start',
        metadata: {
          rideId: rideId || '',
          hasPassengers: ride?.passengers.length || 0,
          ratingsCount: ratings.length,
        },
      })

      // Handle case with no passengers
      if (ratings.length === 0) {
        logger.info('No passengers to rate, completing ride', {
          action: 'finish_ride_no_passengers',
          metadata: {
            rideId: rideId || '',
          },
        })

        Alert.alert(
          '¡Viaje finalizado!',
          'Tu viaje ha sido completado exitosamente',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navigation happens in finally block
              },
            },
          ],
        )
        return
      }

      // Save ratings for passengers
      const ratingsToSave = ratings.map((rating) => ({
        targetUserId: rating.userId,
        rideId: rideId || '',
        rating: rating.rating,
        comment: '',
      }))

      logger.info('Saving passenger ratings', {
        action: 'finish_ride_saving_ratings',
        metadata: {
          rideId: rideId || '',
          ratingsCount: ratingsToSave.length,
        },
      })

      const responses = await Promise.all(
        ratingsToSave.map(async (ratingItem) => {
          return await createRating(ratingItem)
        }),
      )

      const successfulSaves = responses.filter((response) => response !== null)

      if (successfulSaves.length === ratingsToSave.length) {
        logger.info('All ratings saved successfully', {
          action: 'finish_ride_ratings_success',
          metadata: {
            rideId: rideId || '',
            ratingsCount: successfulSaves.length,
          },
        })

        Alert.alert(
          '¡Gracias por tu opinión!',
          'Tu calificación ha sido guardada',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navigation happens in finally block
              },
            },
          ],
        )
      } else {
        logger.warn('Some ratings failed to save', {
          action: 'finish_ride_ratings_partial',
          metadata: {
            rideId: rideId || '',
            successful: successfulSaves.length,
            total: ratingsToSave.length,
          },
        })

        Alert.alert('Aviso', 'Algunas calificaciones no se pudieron guardar')
      }
    } catch (error) {
      logger.exception(error, {
        action: 'finish_ride_error',
        metadata: {
          rideId: rideId || '',
          ratingsCount: ratings.length,
        },
      })

      Alert.alert(
        'Error',
        'Ocurrió un error al finalizar el viaje. Serás redirigido al inicio.',
      )
    } finally {
      // Always refetch bootstrap to ensure app state is updated
      try {
        logger.info('Refetching bootstrap after ride completion', {
          action: 'finish_ride_refetch_bootstrap',
          metadata: {
            rideId: rideId || '',
          },
        })

        const bootstrap = await bootstrapMe()
        if (bootstrap) {
          setBootstrap(bootstrap)
          logger.info('Bootstrap refetched successfully', {
            action: 'finish_ride_bootstrap_success',
            metadata: {
              rideId: rideId || '',
            },
          })
        }
      } catch (bootstrapError) {
        logger.exception(bootstrapError, {
          action: 'finish_ride_bootstrap_error',
          metadata: {
            rideId: rideId || '',
          },
        })
      }

      // Always navigate to home, no matter what
      router.replace('/(tabs)')
      setIsCompleting(false)
    }
  }

  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride) {
        setRide(ride)
      }
    }
    fetchRide()
  }, [rideId])

  const handleEmergencyExit = () => {
    logger.warn('Emergency exit from checkout', {
      action: 'checkout_emergency_exit',
      metadata: {
        rideId: rideId || '',
        isDriver: user?.id === ride?.driver.id,
      },
    })

    Alert.alert(
      'Salir del viaje',
      '¿Estás seguro de que quieres salir? Podrás volver más tarde si es necesario.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              const bootstrap = await bootstrapMe()
              if (bootstrap) {
                setBootstrap(bootstrap)
              }
            } catch (error) {
              logger.exception(error, {
                action: 'checkout_emergency_exit_bootstrap_error',
                metadata: {
                  rideId: rideId || '',
                },
              })
            }
            router.replace('/(tabs)')
          },
        },
      ],
    )
  }

  if (!ride || !ride.origin || !ride.destination) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: COLORS.dark_gray,
            },
            headerTintColor: COLORS.white,
            headerTitle: 'Finalizar viaje',
            headerRight: () => <CloseButton onPress={handleEmergencyExit} />,
          }}
        />
        <SafeScreen>
          <Text>Cargando...</Text>
        </SafeScreen>
      </>
    )
  }

  const priceFormatted = formatCRC(ride.price)
  const isDriver = user?.id === ride.driver.id
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: COLORS.dark_gray,
          },
          headerTintColor: COLORS.white,
          headerTitle: 'Finalizar viaje',
          headerRight: () => <CloseButton onPress={handleEmergencyExit} />,
        }}
      />
      <Screen backgroundColor={COLORS.dark_gray}>
        <ScrollView style={{ flex: 1 }}>
          <MapImage origin={ride.origin} destination={ride.destination} />
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
          {!isDriver && (
            <>
              <AvatarCard user={ride?.driver} role="driver" />
              <AllPassengersCard passengers={ride?.passengers} />
            </>
          )}
          {isDriver && (
            <View>
              <Text
                style={{
                  color: COLORS.white,
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}
              >
                Califica a los pasajeros
              </Text>
              {ride?.passengers.map((passenger) => (
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
                  <Avatar user={passenger} size={42} />
                  <View
                    style={{
                      gap: 4,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                      >
                        {passenger.name}
                      </Text>
                      <StarRating
                        size={28}
                        justifyContent="flex-start"
                        onRatingChange={(rating) => {
                          setRatings((prevRatings) => {
                            // Remove existing rating for this user if it exists
                            const filteredRatings = prevRatings.filter(
                              (r) => r.userId !== passenger.id,
                            )
                            // Add the new rating
                            return [
                              ...filteredRatings,
                              { userId: passenger.id, rating },
                            ]
                          })
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
          {!isDriver && (
            <>
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
              <ActionButton
                onPress={handlePay}
                text={`Pagar ${priceFormatted}`}
                type="primary"
                disabled={!paymentMethod || isPaymentProcessing}
              />
            </>
          )}
          {isDriver && (
            <ActionButton
              onPress={handleCompleteRating}
              text="Finalizar viaje"
              type="primary"
              disabled={isCompleting}
            />
          )}
        </ScrollView>
      </Screen>
    </>
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
