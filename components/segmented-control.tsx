import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  LayoutChangeEvent,
} from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { useState, useRef, useEffect } from 'react'

interface SegmentedControlProps {
  segments: string[]
  selectedIndex: number
  onIndexChange: (index: number) => void
}

export default function SegmentedControl({
  segments,
  selectedIndex,
  onIndexChange,
}: SegmentedControlProps) {
  const animatedValue = useRef(new Animated.Value(selectedIndex)).current
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: selectedIndex,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start()
  }, [selectedIndex, animatedValue])

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setContainerWidth(width)
  }

  const segmentWidth = containerWidth / segments.length
  const indicatorWidth = segmentWidth - 4 // Account for padding

  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl} onLayout={handleLayout}>
        {/* Animated indicator */}
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.indicator,
              {
                width: indicatorWidth,
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: segments.map((_, i) => i),
                      outputRange: segments.map((_, i) => i * segmentWidth + 2),
                    }),
                  },
                ],
              },
            ]}
          />
        )}
        {segments.map((segment, index) => (
          <Pressable
            key={index}
            style={[styles.segment, { width: segmentWidth }]}
            onPress={() => onIndexChange(index)}
          >
            <Text
              style={[
                styles.segmentText,
                selectedIndex === index && styles.selectedSegmentText,
              ]}
            >
              {segment}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: COLORS.primary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.dark_gray,
    borderRadius: 10,
    padding: 2,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    backgroundColor: COLORS.light_gray,
    borderRadius: 8,
    margin: 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segment: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray_400,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        letterSpacing: -0.2,
      },
    }),
  },
  selectedSegmentText: {
    color: COLORS.white,
    fontWeight: '700',
  },
})
