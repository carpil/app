import { useContext, useEffect, useRef, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { Modalize } from 'react-native-modalize'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Platform, Text } from 'react-native'
import { LocationIcon } from '@components/icons'
import ActionButton from '@components/design-system/buttons/action-button'
import Map from '@components/design-system/maps/map'
import SchedulePill from '@components/create-ride-modal/schedule'
import { isAfter } from '@formkit/tempo'
import { createRideRequest } from 'services/api/ride-request'
import { router } from 'expo-router'
import { CreateRideRequestInput } from '~types/ride-request'

const TODAY = new Date()
const TEN_MINUTES = 10 * 60000

export default function RideRequestOverview() {
  const { origin, destination, meetingPoint } = useContext(
    SelectLocationContext,
  )
  const modalizeRef = useRef<Modalize>(null)
  const [date, setDate] = useState<Date>(new Date(Date.now() + TEN_MINUTES))
  const [minDate, setMinDate] = useState(TODAY)

  const handleSearchRide = async () => {
    if (!origin || !destination || !meetingPoint) {
      return
    }

    const createRideRequestInput: CreateRideRequestInput = {
      origin,
      destination,
      departureDate: date,
    }

    const response = await createRideRequest(createRideRequestInput)
    if (!response) {
      return
    }

    router.push('/(tabs)')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!origin || !destination || !meetingPoint) {
    return null
  }

  return (
    <View style={styles.container}>
      <Map
        origin={origin}
        destination={destination}
        meetingPoint={meetingPoint}
      />

      <Modalize
        ref={modalizeRef}
        alwaysOpen={Platform.OS === 'ios' ? 350 : 350}
        modalStyle={{
          backgroundColor: 'transparent',
          marginHorizontal: 20,
        }}
        modalTopOffset={Platform.OS === 'ios' ? 400 : 200}
        avoidKeyboardLikeIOS={true}
      >
        <View>
          <View
            style={{
              backgroundColor: COLORS.dark_gray,
              padding: 15,
              borderRadius: 10,
              gap: 16,
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
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              backgroundColor: COLORS.dark_gray,
              padding: 15,
              borderRadius: 10,
            }}
          >
            <SchedulePill
              date={date}
              minDate={minDate}
              isValid={isAfter(date, TODAY)}
              setDate={setDate}
            />
            <Text style={styles.subtitle}>
              {'Selecciona fecha y hora de tu viaje'}
            </Text>
            <ActionButton
              text="Buscar viaje"
              type="primary"
              onPress={handleSearchRide}
            />
          </View>
        </View>
      </Modalize>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitleBox: {
    fontSize: 12,
    color: COLORS.white_gray,
    textAlign: 'center',
  },
  inactiveTypeBox: {
    borderColor: COLORS.gray_600,
    backgroundColor: COLORS.light_gray,
  },
  inactiveTitleBox: {
    color: COLORS.gray_600,
  },
  inactiveSubtitleBox: {
    color: COLORS.gray_600,
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
  typeBox: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
})
