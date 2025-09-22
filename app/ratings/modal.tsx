import { COLORS } from '@utils/constansts/colors'
import { useRef, useEffect, useState } from 'react'
import { Platform, View, StyleSheet } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { useAuthStore } from 'store/useAuthStore'
import DriverRating from './driver-rating'
import PassengersRating from './passengers-rating'

export default function RatingsModal() {
  const modalizeRef = useRef<Modalize>(null)
  const user = useAuthStore((state) => state.user)
  const [canDismiss, setCanDismiss] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1 = driver, 2 = passengers

  useEffect(() => {
    // Open modal when component mounts
    if (modalizeRef.current) {
      modalizeRef.current.open()
    }
  }, [])

  const handleNext = () => {
    setCurrentStep(2) // Move to passenger ratings
  }

  const handleComplete = () => {
    setCanDismiss(true)
    // Close modal after a smooth transition delay
    setTimeout(() => {
      if (modalizeRef.current) {
        modalizeRef.current.close()
      }
    }, 500) // 500ms delay for smooth transition
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
        // Prevent closing if canDismiss is false
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
        {currentStep === 1 ? (
          <DriverRating user={user} onNext={handleNext} />
        ) : (
          <PassengersRating onComplete={handleComplete} />
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
