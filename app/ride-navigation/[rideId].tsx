import { COLORS } from '@utils/constansts/colors'
import { completeRide, getRide } from 'services/api/rides'
import { logger } from '@utils/logs'
import { Ride } from '~types/ride'
import { Text, View, StyleSheet, Platform, ScrollView } from 'react-native'
import { useAuthStore } from 'store/useAuthStore'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { User } from '~types/user'
import { UsersGroupIcon } from '@components/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FooterCard from './components/footer-card'
import InteractiveModal from '@components/modal/interactive-modal'
import LocationCard from './components/location-card'
import Map from '@components/design-system/maps/map'
import PassengerCard from './components/passenger-card'

export default function RideNavigationScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const user = useAuthStore((state) => state.user)

  const insets = useSafeAreaInsets()

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

  return (
    <View style={styles.container}>
      <Map origin={ride.origin} destination={ride.destination} />
      <InteractiveModal
        AlwaysVisible={
          <LocationCard origin={ride.origin} destination={ride.destination} />
        }
        Content={
          <>
            <View style={styles.passengersSection}>
              <View style={styles.passengerHeader}>
                <UsersGroupIcon color={COLORS.white} size={24} />
                <Text style={styles.passengerTitle}>Pasajeros en el viaje</Text>
              </View>
              <ScrollView
                style={{
                  maxHeight: Platform.OS === 'ios' ? 405 : 325,
                }}
                contentContainerStyle={styles.passengerListContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {allUsers.map((passenger) => (
                  <PassengerCard
                    key={passenger.id}
                    passenger={passenger}
                    chatId={ride.chatId}
                  />
                ))}
              </ScrollView>
            </View>

            <View
              style={[styles.footerContainer, { paddingBottom: insets.bottom }]}
            >
              <FooterCard
                isDriver={isDriver}
                price={ride.price}
                onFinishRide={handleFinishRide}
              />
            </View>
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
    elevation: 0,
    shadowOpacity: 0,
  },
  handle: {
    top: 10,
    width: 40,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
  },
  contentContainer: {
    gap: 12,
  },
  expandableContent: {
    backgroundColor: COLORS.dark_gray,
    borderRadius: 12,
    padding: 16,
  },
  passengersSection: {
    gap: 12,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passengerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  passengerListContent: {
    gap: 8,
  },
  footerContainer: {
    marginTop: 16,
  },
})
