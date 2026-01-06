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
import { useSafeAreaInsets } from 'react-native-safe-area-context'

enum PaymentMethod {
  SINPE_MOVIL = 'sinpe_movil',
  DEBIT_CARD = 'debit_card',
}

export default function Checkout() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()
  const logger = useLogger('CheckoutScreen')
  const insets = useSafeAreaInsets()
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
      return
    }

    if (paymentMethod === PaymentMethod.DEBIT_CARD) {
      try {
        const result = await handlePayment()
        if (result instanceof Error) {
          Alert.alert('Error', result.message)
          return
        }

        logger.info('Payment completed successfully, refetching bootstrap', {
          action: 'payment_complete_refetch_bootstrap',
          metadata: {
            rideId: rideId || '',
          },
        })

        const bootstrap = await bootstrapMe()
        if (bootstrap) {
          setBootstrap(bootstrap)
          logger.info('Bootstrap refetched successfully after payment', {
            action: 'payment_bootstrap_success',
            metadata: {
              rideId: rideId || '',
            },
          })
        }

        router.replace('/(tabs)')
      } catch (error) {
        logger.exception(error, {
          action: 'payment_bootstrap_error',
          metadata: {
            rideId: rideId || '',
          },
        })

        Alert.alert(
          'Error',
          'Ocurrió un error al actualizar el estado. Serás redirigido al inicio.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                router.replace('/(tabs)')
              },
            },
          ],
        )
      }
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

      // Save ratings for passengers (if any)
      if (ratings.length > 0) {
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

        const successfulSaves = responses.filter(
          (response) => response !== null,
        )

        if (successfulSaves.length !== ratingsToSave.length) {
          logger.warn('Some ratings failed to save', {
            action: 'finish_ride_ratings_partial',
            metadata: {
              rideId: rideId || '',
              successful: successfulSaves.length,
              total: ratingsToSave.length,
            },
          })

          Alert.alert('Aviso', 'Algunas calificaciones no se pudieron guardar')
        } else {
          logger.info('All ratings saved successfully', {
            action: 'finish_ride_ratings_success',
            metadata: {
              rideId: rideId || '',
              ratingsCount: successfulSaves.length,
            },
          })
        }
      } else {
        logger.info('No passengers to rate, completing ride', {
          action: 'finish_ride_no_passengers',
          metadata: {
            rideId: rideId || '',
          },
        })
      }

      // Wait for all operations to complete, then refetch bootstrap
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

      // Show success message and navigate
      if (ratings.length > 0) {
        Alert.alert(
          '¡Gracias por tu opinión!',
          'Tu calificación ha sido guardada',
          [
            {
              text: 'Continuar',
              onPress: () => {
                router.replace('/(tabs)')
              },
            },
          ],
        )
      } else {
        Alert.alert(
          '¡Viaje finalizado!',
          'Tu viaje ha sido completado exitosamente',
          [
            {
              text: 'Continuar',
              onPress: () => {
                router.replace('/(tabs)')
              },
            },
          ],
        )
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
        [
          {
            text: 'Continuar',
            onPress: () => {
              router.replace('/(tabs)')
            },
          },
        ],
      )
    } finally {
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

  const passengerToRate = [...ride?.passengers]
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
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              styles.scrollContentWithButton,
            ]}
            showsVerticalScrollIndicator={false}
          >
            <MapImage origin={ride.origin} destination={ride.destination} />
            <Text style={styles.title}>¡Tu viaje ha sido completado!</Text>
            <Text style={styles.subtitle}>Gracias por viajar con Carpil.</Text>
            {!isDriver && (
              <>
                <AvatarCard user={ride?.driver} role="driver" />
                <AllPassengersCard passengers={ride?.passengers} />
              </>
            )}
            {isDriver && (
              <View>
                <Text style={styles.ratingTitle}>Califica a los pasajeros</Text>
                {passengerToRate.map((passenger) => (
                  <View key={passenger.id} style={styles.passengerRatingCard}>
                    <Avatar user={passenger} size={42} />
                    <View style={styles.passengerRatingContent}>
                      <Text style={styles.passengerName}>{passenger.name}</Text>
                      <StarRating
                        size={28}
                        justifyContent="flex-start"
                        onRatingChange={(rating) => {
                          setRatings((prevRatings) => {
                            const filteredRatings = prevRatings.filter(
                              (r) => r.userId !== passenger.id,
                            )
                            return [
                              ...filteredRatings,
                              { userId: passenger.id, rating },
                            ]
                          })
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
            {!isDriver && (
              <View style={styles.paymentSection}>
                <Text style={styles.paymentTitle}>
                  Seleccione una forma de pago
                </Text>
                <View style={styles.paymentOptions}>
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
            )}
          </ScrollView>
          {!isDriver && (
            <View
              style={[
                styles.fixedButtonContainer,
                { paddingBottom: insets.bottom + 16 },
              ]}
            >
              <ActionButton
                onPress={handlePay}
                text={`Pagar ${priceFormatted}`}
                type="primary"
                disabled={!paymentMethod || isPaymentProcessing}
              />
            </View>
          )}
          {isDriver && (
            <View
              style={[
                styles.fixedButtonContainer,
                { paddingBottom: insets.bottom + 16 },
              ]}
            >
              <ActionButton
                onPress={handleCompleteRating}
                text="Finalizar viaje"
                type="primary"
                disabled={isCompleting}
              />
            </View>
          )}
        </View>
      </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContentWithButton: {
    paddingBottom: 100,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 2,
  },
  ratingTitle: {
    color: COLORS.white,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  passengerRatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    borderRadius: 8,
    padding: 8,
    backgroundColor: COLORS.inactive_gray,
    marginBottom: 8,
  },
  passengerRatingContent: {
    gap: 4,
    flex: 1,
  },
  passengerName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentSection: {
    marginTop: 40,
  },
  paymentTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentOptions: {
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
  fixedButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.dark_gray,
    borderTopWidth: 1,
    borderTopColor: COLORS.border_gray,
  },
})
