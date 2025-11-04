import Avatar from '@components/avatar'
import {
  ChatIcon,
  KebabIcon,
  LocationIcon,
  UsersGroupIcon,
} from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { googleMapsTheme } from '@utils/constansts/google-maps-theme'
import { COSTA_RICA_REGION } from 'app/create-ride/ride-overview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useBootstrap } from 'hooks/useBootstrap'
import { useEffect, useRef, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Modalize } from 'react-native-modalize'
import { completeRide, getRide } from 'services/api/rides'
import { formatCRC } from '@utils/currency'
import { Ride } from '~types/ride'
import { User } from '~types/user'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export default function RideNavigationScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const { isDriver } = useBootstrap()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const mapRef = useRef<MapView>(null)
  const modalizeRef = useRef<Modalize>(null)

  const handleFinishRide = async () => {
    try {
      const message = await completeRide(rideId)
      if (message) {
        router.replace('/checkout/' + rideId)
      }
    } catch (error) {
      console.error('Error finishing ride:', error)
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

  useEffect(() => {
    if (ride && mapRef.current && origin && destination) {
      // Fit map to show the entire route
      mapRef.current.fitToCoordinates(
        [
          { latitude: origin.lat!, longitude: origin.lng! },
          { latitude: destination.lat!, longitude: destination.lng! },
        ],
        {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        }
      )
    }
  }, [ride, origin, destination])

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
          <View
            style={{
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
            }}
          >
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
