import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ride } from '../types/ride'
import PassengerAvatar from './passenger-avatar'
import Avatar from './avatar'
import { formatDate } from '../utils/format-date'
import { Link } from 'expo-router'

interface RideCardProps {
  ride: Ride
}

const MARGIN_LEFT = -14

export default function RideCard({ ride }: RideCardProps) {
  const { passengers, driver, availableSeats, departureDate, id } = ride

  const remainingSeats = availableSeats - passengers.length

  const { hour, date } = formatDate(departureDate)

  return (
    <Link href={`/ride/${id}`} asChild style={styles.card}>
      <Pressable
        onPress={() => console.log(`Pressed ${ride.id}`)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Driver and passengers */}
        <View style={styles.pictureContainer}>
          <Avatar user={driver} />
          <View style={styles.passengersContainer}>
            {passengers.map((passenger, index) => (
              <View
                key={passenger.id}
                style={{
                  marginLeft: index === 0 ? 0 : MARGIN_LEFT,
                }}
              >
                <PassengerAvatar user={passenger} />
              </View>
            ))}
            {remainingSeats > 0 && (
              <View style={styles.remainingSeatsContainer}>
                <Text style={styles.remainingSeatsText}>+{remainingSeats}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          {/* Route (origin, destination) */}
          <View style={styles.routeContainer}>
            <Text style={styles.routeText}>{ride.origin}</Text>
            <Text style={styles.arrow}>➡️</Text>
            <Text style={styles.routeText}>{ride.destination}</Text>
          </View>
          {/* Info (departure date, price) */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>{hour}</Text>
              <Text style={styles.infoSubtitle}>{date}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>₡{ride.price}</Text>
              <Text style={styles.infoSubtitle}>{'⛽️'}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    minHeight: 128,
    marginBottom: 8,
  },
  cardPressed: {
    backgroundColor: '#374151',
  },
  pictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 8,
  },
  passengersContainer: {
    flexDirection: 'row',
    marginTop: -8,
  },
  remainingSeatsContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2AADAD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: MARGIN_LEFT,
  },
  remainingSeatsText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
    marginHorizontal: 2,
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    color: '#FFFFFF',
    maxWidth: 110,
  },
  arrow: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
})
