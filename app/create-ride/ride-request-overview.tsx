import { useContext, useEffect, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Text, Alert } from 'react-native'
import { isAfter } from '@formkit/tempo'
import { createRideRequest } from 'services/api/ride-request'
import { CreateRideRequestInput } from '~types/ride-request'
import { router } from 'expo-router'
import ActionButton from '@components/design-system/buttons/action-button'
import InteractiveModal from '@components/modal/interactive-modal'
import LocationCard from 'app/ride-navigation/components/location-card'
import Map from '@components/design-system/maps/map'
import SchedulePill from '@components/create-ride-modal/schedule'

const TEN_MINUTES_MS = 10 * 60000

const getMinDate = () => new Date(Date.now() + TEN_MINUTES_MS)

export default function RideRequestOverview() {
  const { origin, destination, reset } = useContext(SelectLocationContext)
  const [date, setDate] = useState<Date>(getMinDate)
  const [minDate, setMinDate] = useState<Date>(getMinDate)

  const handleSearchRide = async () => {
    if (!origin || !destination) {
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

    Alert.alert(
      '¡Nueva búsqueda creada!',
      'Tu solicitud ha sido creada exitosamente',
      [
        {
          text: 'Continuar',
          onPress: () => {
            reset()
            router.push('/(tabs)')
          },
        },
      ],
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(getMinDate())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!origin || !destination) {
    return null
  }

  return (
    <View style={styles.container}>
      <Map origin={origin} destination={destination} />
      <InteractiveModal
        AlwaysVisible={
          <LocationCard origin={origin} destination={destination} />
        }
        Content={
          <View style={styles.contentBody}>
            <SchedulePill
              date={date}
              minDate={minDate}
              isValid={isAfter(date, minDate)}
              setDate={setDate}
            />
            <Text style={styles.subtitle}>
              Selecciona fecha y hora de tu viaje
            </Text>
            <ActionButton
              text="Buscar viaje"
              type="primary"
              onPress={handleSearchRide}
            />
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBody: {
    gap: 16,
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
})
