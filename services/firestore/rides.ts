import {
  doc,
  collection,
  onSnapshot,
  Unsubscribe,
} from '@react-native-firebase/firestore'
import { Ride } from '~types/ride'
import FirestoreConfig from './config'

export const subscribeToRide = (
  rideId: string,
  onUpdate: (ride: Ride | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const db = FirestoreConfig.getDb()
  const rideRef = doc(db, 'rides', rideId)

  return onSnapshot(
    rideRef,
    (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data()
        if (data) {
          const ride: Ride = {
            id: snapshot.id,
            ...data,
            departureDate: data.departureDate?.toDate() || new Date(),
            deletedAt: data.deletedAt?.toDate() || null,
          } as Ride
          onUpdate(ride)
        } else {
          onUpdate(null)
        }
      } else {
        onUpdate(null)
      }
    },
    (error) => {
      console.error('Error listening to ride updates:', error)
      onError?.(error)
    },
  )
}

export const subscribeToRides = (
  onUpdate: (rides: Ride[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const db = FirestoreConfig.getDb()
  const ridesRef = collection(db, 'rides')

  return onSnapshot(
    ridesRef,
    (snapshot) => {
      const rides: Ride[] = snapshot.docs.map((doc: any) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          departureDate: data.departureDate?.toDate() || new Date(),
          deletedAt: data.deletedAt?.toDate() || null,
        } as Ride
      })
      onUpdate(rides)
    },
    (error) => {
      console.error('Error listening to rides updates:', error)
      onError?.(error)
    },
  )
}
