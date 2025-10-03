import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from '@react-native-firebase/firestore'
import { BootstrapResponse } from '~types/responses/bootstrap'
import { User } from '~types/user'

export const updateUserState = async (
  userId: string,
  state: Partial<BootstrapResponse>,
): Promise<void> => {
  try {
    // Validate userId before proceeding
    if (!userId || userId.trim() === '') {
      console.error('Invalid userId provided to updateUserState:', userId)
      return
    }

    const db = getFirestore()
    // Update the main user document
    const userRef = doc(db, 'users', userId)

    await setDoc(
      userRef,
      {
        ...state,
        lastUpdated: new Date(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error('❌ Failed to update Firebase user state:', error)
  }
}

export const subscribeToUserDocument = (
  userId: string,
  onStateChange: (userData: User) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  try {
    // Validate userId before proceeding
    if (!userId || userId.trim() === '') {
      console.error(
        'Invalid userId provided to subscribeToUserDocument:',
        userId,
      )
      onError(new Error('Invalid userId'))
      return () => {}
    }

    const db = getFirestore()
    const userDocRef = doc(db, 'users', userId)

    console.log('🔍 Setting up user document listener for:', userId)

    return onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data() as User
          console.log('📄 User document updated:', {
            userId,
            currentRideId: userData.currentRideId,
            pendingReviewRideIds: userData.pendingReviewRideIds,
          })
          onStateChange(userData)
        } else {
          console.log('❌ User document does not exist:', userId)
          onError(new Error('User document not found'))
        }
      },
      (error) => {
        console.error('❌ User document listener error:', error)
        onError(error)
      },
    )
  } catch (error) {
    console.error('❌ Failed to set up user document listener:', error)
    onError(error as Error)
    return () => {}
  }
}
