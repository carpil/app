import { useState } from 'react'
import { ScrollView } from 'react-native'
import CreateRideButton from '@components/create-ride-button'
import SafeScreen from '@components/safe-screen'
import RideCard from '@components/ride-card'
import { getRides } from 'services/api/rides'
import { useEffect } from 'react'
import { Ride } from '~types/ride'

export default function Rides() {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    getRides().then(setRides)
  }, [])

  return (
    <SafeScreen>
      <ScrollView>
        {rides.map((ride) => (
          <RideCard ride={ride} key={ride.id} />
        ))}
      </ScrollView>
      <CreateRideButton />
    </SafeScreen>
  )
}
