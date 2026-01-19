import {
  doc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from '@react-native-firebase/firestore'
import { BootstrapResponse } from '~types/responses/bootstrap'
import { User } from '~types/user'
import { logger } from '@utils/logs'
import FirestoreConfig from './config'

const mapBootstrapToFirestore = (
  state: Partial<BootstrapResponse>,
): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    lastUpdated: new Date(),
  }

  if (state.rideId !== undefined) {
    data.currentRideId = state.rideId
  }
  if (state.inRide !== undefined) {
    data.inRide = state.inRide
  }
  if (state.isDriver !== undefined) {
    data.isDriver = state.isDriver
  }
  if (state.pendingReviews !== undefined) {
    data.pendingReviewRideIds = state.pendingReviews?.map((r) => r.id)
  }

  return data
}

export const updateUserState = async (
  userId: string,
  state: Partial<BootstrapResponse>,
): Promise<void> => {
  if (!userId?.trim()) {
    return
  }

  try {
    const db = FirestoreConfig.getDb()
    const userRef = doc(db, 'users', userId)
    const firestoreData = mapBootstrapToFirestore(state)

    await setDoc(userRef, firestoreData, { merge: true })
  } catch (error) {
    logger.exception(error, {
      action: 'firestore_update_user_failed',
      metadata: { userId },
    })
  }
}

export const subscribeToUserDocument = (
  userId: string,
  onStateChange: (userData: User) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  if (!userId?.trim()) {
    onError(new Error('Invalid userId'))
    return () => {}
  }

  try {
    const db = FirestoreConfig.getDb()
    const userDocRef = doc(db, 'users', userId)

    logger.info('Setting up user document listener', {
      action: 'firestore_subscribe_user',
      metadata: { userId },
    })

    return onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (!docSnapshot.exists) {
          onError(new Error('User document not found'))
          return
        }

        const userData = docSnapshot.data() as User
        onStateChange(userData)
      },
      (error) => {
        logger.exception(error, {
          action: 'firestore_user_listener_error',
          metadata: { userId },
        })
        onError(error)
      },
    )
  } catch (error) {
    logger.exception(error, {
      action: 'firestore_subscribe_user_failed',
      metadata: { userId },
    })
    onError(error as Error)
    return () => {}
  }
}
