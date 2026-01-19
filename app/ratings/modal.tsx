import { COLORS } from '@utils/constansts/colors'
import { createRating } from 'services/api/ratings'
import { logger } from '@utils/logs'
import { Modalize } from 'react-native-modalize'
import { PendingReview } from '~types/responses/bootstrap'
import { Platform, View, StyleSheet } from 'react-native'
import { Rating } from '~types/rating'
import { useAuthStore } from 'store/useAuthStore'
import { useRef, useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DriverRating from './driver-rating'
import PassengersRating from './passengers-rating'

interface RatingsModalProps {
  pendingReviews: PendingReview[]
}

export default function RatingsModal({ pendingReviews }: RatingsModalProps) {
  const modalizeRef = useRef<Modalize>(null)
  const user = useAuthStore((state) => state.user)
  const [canDismiss, setCanDismiss] = useState(false)

  const insets = useSafeAreaInsets()

  const driver = pendingReviews.find((review) => review.role === 'driver')
  const passengers = pendingReviews.filter(
    (review) => review.role === 'passenger',
  )

  const [currentStep, setCurrentStep] = useState(() => {
    return driver ? 1 : 2
  })

  useEffect(() => {
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])

  const handleNext = () => {
    if (currentStep === 1) {
      if (passengers.length === 0) {
        logger.info('Completing driver rating with no passengers', {
          action: 'driver_rating_complete',
          metadata: { hasPassengers: false },
        })
        handleComplete()
        return
      }
      logger.info('Moving to passengers rating step', {
        action: 'move_to_passengers_rating',
        metadata: { passengersCount: passengers.length },
      })
      setCurrentStep(2)
      return
    }
    if (currentStep === 2) {
      logger.info('Completing passengers rating', {
        action: 'passengers_rating_complete',
        metadata: { passengersCount: passengers.length },
      })
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

  const handleSaveRating = async (rating: Rating | Rating[]): Promise<void> => {
    const ratingsToSave = Array.isArray(rating) ? rating : [rating]

    logger.info('Saving ratings', {
      action: 'save_ratings_start',
      metadata: { count: ratingsToSave.length },
    })

    const responses = await Promise.all(
      ratingsToSave.map(async (ratingItem) => {
        return await createRating(ratingItem)
      }),
    )

    const successfulSaves = responses.filter((response) => response !== null)

    if (successfulSaves.length === ratingsToSave.length) {
      logger.info('All ratings saved successfully', {
        action: 'save_ratings_success',
        metadata: { count: ratingsToSave.length },
      })
    } else {
      logger.error('Some ratings failed to save', {
        action: 'save_ratings_partial',
        metadata: {
          saved: successfulSaves.length,
          total: ratingsToSave.length,
        },
      })
      throw new Error(
        `Only ${successfulSaves.length} of ${ratingsToSave.length} ratings were saved`,
      )
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
          paddingBottom:
            Platform.OS === 'ios' ? insets.bottom : insets.bottom + 40,
        }}
      >
        {currentStep === 1 && driver && (
          <DriverRating
            user={driver}
            onNext={handleNext}
            onSaveRating={handleSaveRating}
            hasOtherPassengers={passengers.length > 0}
          />
        )}
        {currentStep === 2 && (
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
  },
})
