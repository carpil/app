import { COLORS } from '@utils/constansts/colors'
import { useRef, useEffect, useState } from 'react'
import { Platform, View, StyleSheet } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { useAuthStore } from 'store/useAuthStore'
import DriverRating from './driver-rating'
import PassengersRating from './passengers-rating'
import { PendingReview } from '~types/responses/bootstrap'
import { Rating } from '~types/rating'
import { createRating } from 'services/api/ratings'

interface RatingsModalProps {
  pendingReviews: PendingReview[]
}

export default function RatingsModal({ pendingReviews }: RatingsModalProps) {
  const modalizeRef = useRef<Modalize>(null)
  const user = useAuthStore((state) => state.user)
  const [canDismiss, setCanDismiss] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const driver = pendingReviews.find((review) => review.role === 'driver')
  const passengers = pendingReviews.filter(
    (review) => review.role === 'passenger',
  )

  useEffect(() => {
    if (driver) {
      setCurrentStep(1)
    } else {
      setCurrentStep(2)
    }
  }, [driver, passengers])

  useEffect(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])

  const handleNext = () => {
    if (currentStep === 1 && passengers.length === 0) {
      handleComplete()
    }
    if (currentStep === 1) {
      setCurrentStep(2)
    }
    if (currentStep === 2) {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setCanDismiss(true)
    setTimeout(() => {
      if (modalizeRef.current) {
        modalizeRef.current.close()
      }
    }, 500)
  }

  const handleSaveRating = async (rating: Rating) => {
    try {
      const response = await createRating(rating)
      if (response) {
        console.log('Rating saved successfully')
      }
    } catch (error) {
      console.log('Error saving rating', error)
    }
  }

  if (user == null) {
    return null
  }

  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={{
        backgroundColor: COLORS.dark_gray,
      }}
      modalTopOffset={Platform.OS === 'ios' ? 100 : 50}
      avoidKeyboardLikeIOS={true}
      adjustToContentHeight={true}
      disableScrollIfPossible={false}
      closeOnOverlayTap={canDismiss}
      closeSnapPointStraightEnabled={canDismiss}
      onClosed={() => {
        if (!canDismiss && modalizeRef.current) {
          modalizeRef.current.open()
        }
      }}
    >
      <View
        style={{
          ...styles.container,
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        }}
      >
        {currentStep === 1 && driver && (
          <DriverRating
            user={driver}
            onNext={handleNext}
            onSaveRating={handleSaveRating}
          />
        )}
        {currentStep === 2 && passengers.length > 0 && (
          <PassengersRating
            onComplete={handleComplete}
            onSaveRating={handleSaveRating}
            passengers={passengers}
          />
        )}
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    gap: 20,
    paddingTop: 20,
    backgroundColor: COLORS.dark_gray,
    paddingBottom: 40,
  },
})
