import { useContext, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Platform, Text } from 'react-native'
import { SelectLocationContext } from '../../context/select-location'
import MapView, { Marker, Region } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { googleMapsTheme } from '../../utils/constansts/google-maps-theme'
import { Modalize } from 'react-native-modalize'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import RideLocationsPill from '../../components/create-ride-modal/locations'
import PassengersPill from '../../components/create-ride-modal/passengers'
import SchedulePill from '../../components/create-ride-modal/schedule'
import PricePill from '../../components/create-ride-modal/price'
import CreateRide from '../../components/create-ride-modal/create-button'
import { Ride } from '../../types/ride'
import { isAfter } from '@formkit/tempo'

const MAX_PASSENGERS = 15
const TODAY = new Date()
const TEN_MINUTES = 10 * 60000
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

const COSTA_RICA_REGION: Region = {
  latitude: 9.7489,
  latitudeDelta: 5.0,
  longitude: -83.7534,
  longitudeDelta: 5.0,
}

export default function RideOverview() {
  const { origin, destination } = useContext(SelectLocationContext)
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

  const onCreateRide = () => {
    const ride: Ride = {
      id: 'ride1',
      origin,
      destination,
      meetingPoint: null,
      availableSeats: passengers,
      price: parseInt(price),
      departureDate: date,
      passengers: [],
      driver: {
        id: 'driver1',
        name: 'Leonardo DiCaprio',
        profilePicture:
          'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg',
      },
      deletedAt: null,
      status: 'active',
      chatId: 'chat1',
    }

    console.log(ride)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const isValid = passengers > 0 && price !== '' && isAfter(date, TODAY)

  if (!origin || !destination) {
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
            strokeColor={'#6F52EA'}
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
        </MapView>

        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 100 : 100}
          modalStyle={{
            backgroundColor: 'transparent',
            marginBottom: 30,
          }}
          modalTopOffset={Platform.OS === 'ios' ? 120 : 68}
          avoidKeyboardLikeIOS={true}
        >
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              gap: 20,
            }}
          >
            <RideLocationsPill origin={origin} destination={destination} />
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
    color: '#111827',
  },
})
