import { useEffect, useState } from 'react'
import { getRides } from 'services/api/rides'
import { Ride } from '~types/ride'
import { ScrollView } from 'react-native'
import CreateRideButton from '@components/create-ride-button'
import RideCard from '@components/ride-card'
import SafeScreen from '@components/safe-screen'

export default function Index() {
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
