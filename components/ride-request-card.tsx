import { View, Text, StyleSheet, Pressable } from 'react-native'
import { RideRequest } from '~types/ride-request'
import Avatar from '@components/avatar'
import { formatDate } from '@utils/format-date'
import { Link } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'

interface RideRequestCardProps {
  rideRequest: RideRequest
}

export default function RideRequestCard({ rideRequest }: RideRequestCardProps) {
  const { creator, departureDate, id, origin, destination } = rideRequest

  const { hour, date } = formatDate(departureDate)

  const originName = origin?.name.primary || ''
  const destinationName = destination?.name.primary || ''

  return (
    <Link href={`/ride-request/${id}`} asChild style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Creator avatar */}
        <View style={styles.pictureContainer}>
          <Avatar user={creator} />
        </View>
        <View style={styles.detailsContainer}>
          {/* Route (origin, destination) */}
          <View style={styles.routeContainer}>
            <Text style={styles.routeText}>{originName}</Text>
            <Text style={styles.arrow}>➡️</Text>
            <Text style={styles.routeText}>{destinationName}</Text>
          </View>
          {/* Info (departure date) */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>{date}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>{hour}</Text>
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
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderColor: COLORS.border_gray,
    backgroundColor: COLORS.inactive_gray,
    paddingVertical: 12,
    minHeight: 128,
    marginBottom: 8,
  },
  cardPressed: {
    backgroundColor: COLORS.border_gray,
  },
  pictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 8,
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: COLORS.border_gray,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.white,
    textTransform: 'capitalize',
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
    color: COLORS.white,
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
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: COLORS.gray_400,
  },
  requestLabel: {
    fontSize: 14,
    color: COLORS.gray_400,
    fontStyle: 'italic',
  },
})
