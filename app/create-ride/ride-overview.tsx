import { useContext, useEffect, useRef, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { createRide } from 'services/api/rides'
import { CreateRideRequest } from '~types/requests/ride'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { googleMapsTheme } from '@utils/constansts/google-maps-theme'
import { isAfter } from '@formkit/tempo'
import { Modalize } from 'react-native-modalize'
import { router } from 'expo-router'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Platform, Text } from 'react-native'
import CreateRide from '@components/create-ride-modal/create-button'
import MapView, { Marker, Region } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PassengersPill from '@components/create-ride-modal/passengers'
import PricePill from '@components/create-ride-modal/price'
import SchedulePill from '@components/create-ride-modal/schedule'
import { LocationIcon } from '@components/icons'

const MAX_PASSENGERS = 15
const TODAY = new Date()
const TEN_MINUTES = 10 * 60000
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export const COSTA_RICA_REGION: Region = {
  latitude: 9.7489,
  latitudeDelta: 5.0,
  longitude: -83.7534,
  longitudeDelta: 5.0,
}

export default function RideOverview() {
  const { origin, destination, meetingPoint } = useContext(
    SelectLocationContext,
  )
  const mapRef = useRef(null)
  const modalizeRef = useRef<Modalize>(null)

  const [passengers, setPassengers] = useState<number>(3)
  const [date, setDate] = useState<Date>(new Date(Date.now() + TEN_MINUTES))
  const [price, setPrice] = useState('')
  const [minDate, setMinDate] = useState(TODAY)

  const handleMinusPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1)
    }
  }

  const handlePlusPassengers = () => {
    if (passengers < MAX_PASSENGERS) {
      setPassengers(passengers + 1)
    }
  }

  const onCreateRide = async () => {
    if (!origin || !destination || !meetingPoint) {
      return
    }

    const rideRequest: CreateRideRequest = {
      origin,
      destination,
      meetingPoint,
      availableSeats: passengers,
      price: parseInt(price),
      departureDate: date,
    }

    const ride = await createRide(rideRequest)
    if (!ride) {
      return
    }
    router.replace('/(tabs)')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const isValid = passengers > 0 && price !== '' && isAfter(date, TODAY)

  if (!origin || !destination || !meetingPoint) {
    return <Text>Selecciona tu origen y destino</Text>
  }

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
              latitude: origin.location.lat!,
              longitude: origin.location.lng!,
            }}
            destination={{
              latitude: destination.location.lat!,
              longitude: destination.location.lng!,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
          />
          <Marker
            coordinate={{
              latitude: origin.location.lat!,
              longitude: origin.location.lng!,
            }}
            title="Origin"
            description="Origin"
          />
          <Marker
            coordinate={{
              latitude: destination.location.lat!,
              longitude: destination.location.lng!,
            }}
            title="Destination"
            description="Destination"
          />
          <Marker
            coordinate={{
              latitude: meetingPoint.location.lat!,
              longitude: meetingPoint.location.lng!,
            }}
            title="Meeting Point"
            description="Meeting Point"
          />
        </MapView>

        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 120 : 135}
          modalStyle={{
            backgroundColor: COLORS.dark_gray,
          }}
          modalTopOffset={Platform.OS === 'ios' ? 100 : 50}
          avoidKeyboardLikeIOS={true}
        >
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              gap: 20,
              paddingTop: 20,
              backgroundColor: COLORS.dark_gray,
              paddingBottom: Platform.OS === 'ios' ? 40 : 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.primary} />
              <View>
                <Text style={styles.locationTitle}>{origin.name.primary}</Text>
                <Text style={styles.locationSubtitle}>
                  {origin.name.secondary}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.secondary} />
              <View>
                <Text style={styles.locationTitle}>
                  {destination.name.primary}
                </Text>
                <Text style={styles.locationSubtitle}>
                  {destination.name.secondary}
                </Text>
              </View>
            </View>
            <PassengersPill
              passengers={passengers}
              handleMinus={handleMinusPassengers}
              handlePlus={handlePlusPassengers}
            />
            <SchedulePill
              date={date}
              minDate={minDate}
              isValid={isAfter(date, TODAY)}
              setDate={setDate}
            />
            <PricePill
              price={price}
              handleChangePrice={setPrice}
              isValid={price !== ''}
            />
            <CreateRide onPress={onCreateRide} disabled={!isValid} />
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
  modal: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.dark_gray,
  },
  containerLocations: {
    flex: 1,
    marginHorizontal: 30,
    gap: 20,
    paddingTop: 20,
    backgroundColor: COLORS.dark_gray,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
  locationTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationSubtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentMethodsContainer: {
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
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButtonTextDisabled: {
    color: COLORS.gray_400,
  },
})
