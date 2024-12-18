import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { formatDate } from '../../utils/format-date'
import { rideRequests } from '../../utils/mocks/ride-requests'
import { Stack, useLocalSearchParams } from 'expo-router'
import Avatar from '../../components/avatar'
import ReservationButton from '../../components/reservation-button'
import Screen from '../../components/screen'

export default function RideRequestDetails() {
  const { id } = useLocalSearchParams()

  const rideRequest = rideRequests.find((rideRequest) => rideRequest.id === id)

  if (!rideRequest) {
    return <Text>No se encontró el ride request</Text>
  }

  const { creator, origin, destination, departureDate, spaces } = rideRequest

  const { hour, date } = formatDate(departureDate)

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#6F52EA',
          },
          headerTitle: 'Carpil',
          headerBackTitle: 'Volver',
        }}
      />
      <ScrollView>
        <View style={styles.avatarContainer}>
          <Avatar user={creator} size={100} />
          <Text style={styles.creatorName}>{creator.name}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.subheading}>Busca ride</Text>
          <View style={styles.card}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{origin}</Text>
              <Text style={styles.arrow}>{'➡️'}</Text>
              <Text style={styles.routeText}>{destination}</Text>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.card}>
              <View style={styles.detailContainer}>
                <Text style={styles.largeText}>{hour}</Text>
                <Text style={styles.secondaryText}>{date}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.detailContainer}>
                <Text style={styles.largeText}>{spaces}</Text>
                <Text style={styles.secondaryText}>Espacios</Text>
              </View>
            </View>
          </View>
        </View>
        <ReservationButton
          onPress={() => console.log(`ride request ${id} pressed`)}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  avatarContainer: {
    padding: 12,
    alignItems: 'center',
  },
  creatorName: {
    color: 'black', // text-gray-950
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    gap: 8,
  },
  subheading: {
    color: '#111827', // text-gray-900
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#111827', // bg-gray-900
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 64,
  },
  routeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailContainer: {
    alignItems: 'center',
    minHeight: 64,
  },
  largeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryText: {
    fontSize: 14,
    color: '#9CA3AF', // text-gray-400
    textAlign: 'center',
  },
  deletedText: {
    fontSize: 14,
    color: '#1F2937', // text-gray-900
    marginTop: 20,
  },
})
