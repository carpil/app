import { doc, onSnapshot, Unsubscribe } from '@react-native-firebase/firestore'
import { User } from '~types/user'
import FirestoreConfig from './config'
import { logger } from '@utils/logs'

export const subscribeToUser = (
  userId: string,
  onUpdate: (user: User | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  const db = FirestoreConfig.getDb()
  const userRef = doc(db, 'users', userId)

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data()
        if (data) {
          const user: User = {
            id: snapshot.id,
            ...data,
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as User
          onUpdate(user)
        } else {
          onUpdate(null)
        }
      } else {
        onUpdate(null)
      }
    },
    (error) => {
      logger.exception(error, {
        action: 'user_listener_error',
        metadata: { userId },
      })
      onError?.(error)
    },
  )
}
