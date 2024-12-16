import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

const driverProfilePicture =
  'https://cdn-images.dzcdn.net/images/artist/03ac3759cf240640d902d9aa5a067632/1900x1900-000000-80-0-0.jpg'

const route = {
  origin: 'Ciudad Quesada',
  destination: 'San José',
}

export default function RideCard() {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.pictureContainer}>
        <Image
          source={{ uri: driverProfilePicture }}
          style={styles.driverImage}
        />
        <View style={styles.passengersContainer}>
          <Image
            source={{ uri: driverProfilePicture }}
            style={styles.passengerImage}
          />
          <View style={styles.remainingSeatsContainer}>
            <Text style={styles.remainingSeatsText}>+3</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.routeContainer}>
          <Text style={styles.routeText}>{route.origin}</Text>
          <Text style={styles.arrow}>➡️</Text>
          <Text style={styles.routeText}>{route.destination}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>11:30 am</Text>
            <Text style={styles.infoSubtitle}>16/12/2024</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>₡5000</Text>
            <Text style={styles.infoSubtitle}>{'⛽️'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  pictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 8,
  },
  driverImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  passengersContainer: {
    flexDirection: 'row',
  },
  passengerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1F2937',
    marginLeft: -8,
  },
  passengerPlaceholderContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  passengerPlaceholderText: {
    fontSize: 12,
    color: '#D1D5DB',
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
    marginLeft: -8,
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
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#FFFFFF',
    maxWidth: 72,
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
