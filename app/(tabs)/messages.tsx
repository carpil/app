import { ScrollView } from 'react-native'
import SafeScreen from '@components/safe-screen'
import RideCard from '@components/ride-card'
import { Ride } from '~types/ride'
import { getRides } from 'services/api/rides'
import { useEffect, useState } from 'react'
import CreateRideButton from '@components/create-ride-button'

export default function Messages() {
  const [rides, setRides] = useState<Ride[]>([])

  useEffect(() => {
    getRides().then((rides) => {
      setRides(rides)
    })
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
