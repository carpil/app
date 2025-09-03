import { useState } from 'react'
import { ScrollView } from 'react-native'
import CreateRideButton from '@components/create-ride-button'
import SafeScreen from '@components/safe-screen'
import RideCard from '@components/ride-card'
import RideCardSkeleton from '@components/skeletons/ride-card'
import { getRides } from 'services/api/rides'
import { useEffect } from 'react'
import { Ride } from '~types/ride'

export default function Rides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const rides = await getRides()
        setRides(rides)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRides()
  }, [])

  return (
    <SafeScreen>
      <ScrollView>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <RideCardSkeleton key={`skeleton-${index}`} />
            ))
          : rides.map((ride) => <RideCard ride={ride} key={ride.id} />)}
      </ScrollView>
      <CreateRideButton />
    </SafeScreen>
  )
}
