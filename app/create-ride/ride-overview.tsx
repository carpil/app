import { useContext, useEffect, useRef, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { createRide } from 'services/api/rides'
import { CreateRideRequest } from '~types/requests/ride'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { isAfter } from '@formkit/tempo'
import { Modalize } from 'react-native-modalize'
import { router } from 'expo-router'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Platform, Text } from 'react-native'
import { StyledAlert } from '@components/styled-alert'
import PassengersPill from '@components/create-ride-modal/passengers'
import PricePill from '@components/create-ride-modal/price'
import SchedulePill from '@components/create-ride-modal/schedule'
import { LocationIcon } from '@components/icons'
import ActionButton from '@components/design-system/buttons/action-button'
import Map from '@components/design-system/maps/map'

const MAX_PASSENGERS = 15
const TODAY = new Date()
const TEN_MINUTES = 10 * 60000

export default function RideOverview() {
  const { origin, destination, meetingPoint, reset } = useContext(
    SelectLocationContext,
  )

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

    StyledAlert.alert('¡Viaje creado!', 'Tu viaje ha sido publicado exitosamente', [
      {
        text: 'Continuar',
        onPress: () => {
          reset()
          router.replace('/(tabs)')
        },
      },
    ])
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
        <Map
          origin={origin}
          destination={destination}
          meetingPoint={meetingPoint}
        />

        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 140 : 135}
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
            <ActionButton
              onPress={onCreateRide}
              text="Crear viaje"
              type="primary"
              disabled={!isValid}
            />
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
