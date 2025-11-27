import { useEffect, useState } from 'react'
import { Ride } from '~types/ride'
import { subscribeToRide } from 'services/firestore/rides'
import { getRide } from 'services/api/rides'

export const useRealtimeRide = (rideId: string) => {
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupRealtimeUpdates = async () => {
      try {
        setLoading(true)
        setError(null)

        const initialRide = await getRide(rideId)
        if (initialRide) {
          setRide(initialRide)
        }

        unsubscribe = subscribeToRide(
          rideId,
          (updatedRide) => {
            if (updatedRide) {
              setRide(updatedRide)
              setError(null)
            } else {
              setError('Ride no encontrado')
            }
            setLoading(false)
          },
          (error) => {
            console.error('Real-time update error:', error)
            setError('Error de conexión en tiempo real')
            setLoading(false)
          },
        )
      } catch (err) {
        setError('No se encontró el ride')
        console.error('Error fetching ride:', err)
        setLoading(false)
      }
    }

    setupRealtimeUpdates()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [rideId])

  return { ride, loading, error }
}
