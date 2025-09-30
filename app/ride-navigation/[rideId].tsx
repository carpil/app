import PrimaryButton from '@components/buttons/primary'
import SafeScreen from '@components/safe-screen'
import { useLocalSearchParams } from 'expo-router'
import { useDriver } from 'hooks/useDriver'
import { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { completeRide, getRide } from 'services/api/rides'
import { Ride } from '~types/ride'

export default function RideNavigationScreen() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const { calculateDriver } = useDriver()

  const [ride, setRide] = useState<Ride | null>(null)
  const [isDriver, setIsDriver] = useState(false)

  const handleFinishRide = async () => {
    const message = await completeRide(rideId)
    console.log({ message })
  }

  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride == null) {
        return
      }
      setRide(ride)
      setIsDriver(calculateDriver(ride.driver.id))
    }
    fetchRide()
  }, [rideId, calculateDriver])

  if (ride == null) {
    return null
  }

  return (
    <SafeScreen>
      <Text>Ride Navigation</Text>
      <Text>{rideId}</Text>

      {isDriver && (
        <PrimaryButton text="Finalizar viaje" onPress={handleFinishRide} />
      )}
    </SafeScreen>
  )
}
