import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Screen from '@components/screen'
import Avatar from '@components/avatar'
import { formatDate } from '@utils/format-date'
import { COLORS } from '@utils/constansts/colors'
import { joinRide, startRide, unjoinRide } from 'services/api/rides'
import { useRealtimeRide } from 'hooks/useRealtimeRide'
import { useDriver } from 'hooks/useDriver'
import ActionButton from '@components/design-system/buttons/action-button'
import { useAuthStore } from 'store/useAuthStore'

export default function RideDetails() {
  const { id } = useLocalSearchParams()
  const rideId = id as string
  const { ride, loading, error } = useRealtimeRide(rideId)
  const { calculateDriver } = useDriver()
  const router = useRouter()
  const { user } = useAuthStore()

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando detalles del ride...</Text>
        </View>
      </Screen>
    )
  }

  if (error || !ride) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🚗</Text>
          <Text style={styles.errorTitle}>Ride no encontrado</Text>
          <Text style={styles.errorMessage}>
            {error || 'El ride que buscas no existe o ya no está disponible.'}
          </Text>
        </View>
      </Screen>
    )
  }

  const {
    driver,
    origin,
    destination,
    meetingPoint,
    departureDate,
    price,
    passengers,
    availableSeats,
  } = ride

  const isDriver = calculateDriver(driver.id)
  const isPassenger = user ? passengers.some((p) => p.id === user.id) : false

  const remainingSeats = availableSeats - passengers.length
  const fullSeats = availableSeats === passengers.length

  const { hour, date } = formatDate(departureDate)

  const handleJoinRide = async () => {
    try {
      const message = await joinRide(rideId)
      if (message) {
        console.log('Successfully joined ride:', message)
      } else {
        console.log('Failed to join ride')
      }
    } catch (error) {
      console.error('Error joining ride:', error)
    }
  }

  const handleUnjoinRide = async () => {
    try {
      const message = await unjoinRide(rideId)
      if (message) {
        console.log('Successfully unjoined ride:', message)
      } else {
        console.log('Failed to unjoin ride')
      }
    } catch (error) {
      console.error('Error unjoining ride:', error)
    }
  }

  const handleStartRide = async () => {
    try {
      const message = await startRide(rideId)
      console.log({ message })
      if (message) {
        router.push(`/ride-navigation/${rideId}`)
      }
    } catch (error) {
      console.error('Error starting ride:', error)
    }
  }

  return (
    <Screen>
      <ScrollView>
        <View style={styles.pictureContainer}>
          <Avatar user={driver} size={100} goToUserDetails={true} />
          <Text style={styles.driverName}>{driver.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.card}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{origin?.name.primary}</Text>
              <Text style={styles.arrow}>➡️</Text>
              <Text style={styles.routeText}>{destination?.name.primary}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.meetingPointContainer}>
              <Text
                style={styles.meetingPointText}
              >{`📍 ${meetingPoint?.name.primary}`}</Text>
              <Text style={styles.meetingPointSubtitle}>
                Punto de encuentro
              </Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.card}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{hour}</Text>
                <Text style={styles.infoSubtitle}>{date}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{`₡${price}`}</Text>
                <Text style={styles.infoSubtitle}>precio por pasajero</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View
              style={
                passengers.length >= 1 && remainingSeats > 0
                  ? styles.passengerRowBetween
                  : styles.passengerRowCenter
              }
            >
              <View style={styles.passengerContainer}>
                {passengers.map((passenger) => (
                  <Avatar
                    key={passenger.id}
                    user={passenger}
                    size={48}
                    goToUserDetails={true}
                  />
                ))}
              </View>
              {!fullSeats && (
                <View style={styles.remainingSeatsContainer}>
                  <Text style={styles.remainingSeatsText}>
                    {remainingSeats}
                  </Text>
                  <Text style={styles.remainingSeatsSubtitle}>Disponible</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {isDriver ? (
          <ActionButton
            onPress={handleStartRide}
            text="Iniciar viaje"
            type="secondary"
          />
        ) : isPassenger ? (
          <ActionButton
            onPress={handleUnjoinRide}
            text="Cancelar espacio"
            type="secondary"
          />
        ) : (
          <ActionButton
            onPress={handleJoinRide}
            text="Reservar espacio"
            type="secondary"
          />
        )}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
  },
  pictureContainer: {
    padding: 12,
    alignItems: 'center',
  },
  driverName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
    gap: 8,
  },
  card: {
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '100%',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 64,
  },
  routeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 24,
  },
  meetingPointContainer: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  meetingPointText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  meetingPointSubtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  infoBlock: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  infoTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  passengerRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 64,
  },
  passengerRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 64,
  },
  passengerContainer: {
    flexDirection: 'row',
    maxHeight: 160,
    gap: 4,
  },
  remainingSeatsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingSeatsText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  remainingSeatsSubtitle: {
    fontSize: 14,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  deletedText: {
    fontSize: 14,
    color: COLORS.inactive_gray,
    marginTop: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.gray_400,
    textAlign: 'center',
    marginTop: 5,
  },
})
