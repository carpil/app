import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { StarFilledIcon, StarOutlineIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { useState } from 'react'

interface StarRatingProps {
  onRatingChange?: (rating: number, userId?: string) => void
  initialRating?: number
  maxRating?: number
  userId?: string
  size?: number
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
}

export default function StarRating({
  onRatingChange,
  initialRating = 0,
  maxRating = 5,
  userId,
  size = 30,
  justifyContent = 'center',
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)

  const handleStarPress = (starIndex: number) => {
    const newRating = starIndex + 1
    setRating(newRating)
    onRatingChange?.(newRating, userId)
  }

  const renderStar = (index: number) => {
    const isFilled = index < rating
    const StarIcon = isFilled ? StarFilledIcon : StarOutlineIcon
    const starColor = isFilled ? COLORS.star_yellow : COLORS.gray_600

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        style={styles.starButton}
        activeOpacity={0.7}
      >
        <StarIcon color={starColor} size={size} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { justifyContent }]}>
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
  },
  starButton: {
    // padding: 5,
  },
})
