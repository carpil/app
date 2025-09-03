import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

interface ShimmerProps {
  children: React.ReactNode
  isVisible?: boolean
}

export function Shimmer({ children, isVisible = true }: ShimmerProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ]),
      ).start()
    }

    if (isVisible) {
      startShimmer()
    }
  }, [shimmerAnim, isVisible])

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <Animated.View style={{ opacity: shimmerOpacity }}>
      {children}
    </Animated.View>
  )
}
