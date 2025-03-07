import { Text, ScrollView, View, StyleSheet } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import Screen from '../../components/screen'
import { rides } from '../../utils/mocks/rides'
import Avatar from '../../components/avatar'
import { formatDate } from '../../utils/format-date'
import ReservationButton from '../../components/reservation-button'
import { COLORS } from '../../utils/constansts/colors'

export default function RideDetails() {
  const { id } = useLocalSearchParams()

  const ride = rides.find((ride) => ride.id === id)

  if (!ride) {
    return <Text>No se encontró el ride</Text>
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

  const remainingSeats = availableSeats - passengers.length
  const fullSeats = availableSeats === passengers.length

  const { hour, date } = formatDate(departureDate)

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitle: 'Carpil',
          headerBackTitle: 'Volver',
        }}
      />
      <ScrollView>
        <View style={styles.pictureContainer}>
          <Avatar user={driver} size={100} />
          <Text style={styles.driverName}>{driver.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.card}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{origin}</Text>
              <Text style={styles.arrow}>➡️</Text>
              <Text style={styles.routeText}>{destination}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.meetingPointContainer}>
              <Text
                style={styles.meetingPointText}
              >{`📍 ${meetingPoint}`}</Text>
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
                  <Avatar key={passenger.id} user={passenger} size={48} />
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

        <ReservationButton onPress={() => console.log('reservar')} />
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
})
