import Avatar from '@components/avatar'
import {
  ChatIcon,
  KebabIcon,
  LocationIcon,
  UsersGroupIcon,
} from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import { completeRide, getRide } from 'services/api/rides'
import { formatCRC } from '@utils/currency'
import { Ride } from '~types/ride'
import { User } from '~types/user'
import ActionButton from '@components/design-system/buttons/action-button'
import Map from '@components/design-system/maps/map'
import { useAuthStore } from 'store/useAuthStore'
import { logger } from '@utils/logs'

export default function RideNavigationScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const modalizeRef = useRef<Modalize>(null)
  const user = useAuthStore((state) => state.user)
  const handleFinishRide = async () => {
    try {
      const message = await completeRide(rideId)
      if (message) {
        router.replace('/checkout/' + rideId)
      }
    } catch (error) {
      logger.exception(error, {
        action: 'complete_ride_error',
        metadata: { rideId },
      })
    }
  }

  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride == null) {
        logger.error('Failed to load ride for navigation', {
          action: 'ride_navigation_load_failed',
          metadata: { rideId },
        })
        return
      }
      logger.info('Ride navigation loaded successfully', {
        action: 'ride_navigation_loaded',
        metadata: {
          rideId,
          passengerCount: ride.passengers.length,
          hasDriver: !!ride.driver,
        },
      })
      setRide(ride)
    }
    fetchRide()
  }, [rideId])

  if (ride == null || ride.origin == null || ride.destination == null) {
    return null
  }

  const allUsers = [ride.driver, ...ride.passengers] as User[]

  const isDriver = user?.id === ride.driver.id
  const driverOffset = isDriver ? 0 : 50

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Map origin={ride.origin} destination={ride.destination} />
        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 135 + driverOffset : 135}
          modalStyle={{
            backgroundColor: COLORS.dark_gray,
            padding: 15,
            paddingVertical: 15,
          }}
          modalTopOffset={
            Platform.OS === 'ios' ? 450 + driverOffset : 200 + driverOffset
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
              <ActionButton
                onPress={handleFinishRide}
                text="Completar viaje"
                type="primary"
              />
            )}
            {!isDriver && (
              <>
                <View style={styles.paymentInfoContainer}>
                  <Text style={styles.paymentInfoLabel}>Total a pagar:</Text>
                  <Text style={styles.paymentInfoAmount}>
                    {formatCRC(ride.price)}
                  </Text>
                </View>
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
