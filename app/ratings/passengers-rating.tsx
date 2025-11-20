import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import Avatar from '@components/avatar'
import { useAuthStore } from 'store/useAuthStore'
import StarRating from './star-rating'
import { useState } from 'react'
import { Rating } from '~types/rating'
import { UserInfo } from '~types/user'
import { useBootstrap } from 'hooks/useBootstrap'
import ActionButton from '@components/design-system/buttons/action-button'

interface PassengersRatingProps {
  onComplete?: () => void
  onSaveRating: (rating: Rating | Rating[]) => void
  passengers: UserInfo[]
}

export interface RatingComponentProps {
  userId: string
  rating: number
}

export default function PassengersRating({
  onComplete,
  onSaveRating,
  passengers,
}: PassengersRatingProps) {
  const user = useAuthStore((state) => state.user)
  const { rideId } = useBootstrap()
  const [ratings, setRatings] = useState<RatingComponentProps[]>([])

  if (user == null) {
    return null
  }

  const handleRatingComplete = () => {
    console.log('📝 Collected ratings:', ratings)
    console.log('📝 Number of passengers to rate:', passengers.length)
    console.log('📝 Number of ratings collected:', ratings.length)

    if (ratings.length === 0) {
      console.log('⚠️ No ratings collected, skipping save')
      onComplete?.()
      return
    }

    const ratingsToSave = ratings.map((rating) => ({
      targetUserId: rating.userId,
      rideId: rideId || '',
      rating: rating.rating,
      comment: '',
    }))

    console.log('📝 Ratings to save:', ratingsToSave)
    onSaveRating(ratingsToSave)
    onComplete?.()
  }

  return (
    <>
      <Text style={styles.text}>{'¿Cómo calificarías a los pasajeros?'}</Text>
      {passengers.map((passenger) => (
        <View key={passenger.id} style={styles.passengerContainer}>
          <View style={styles.passengerRatingContainer}>
            <Avatar
              user={{
                id: passenger.id,
                name: passenger.name,
                profilePicture: passenger.profilePicture,
              }}
              size={48}
            />
            <View style={styles.passengersInfo}>
              <Text style={styles.name}>{passenger.name}</Text>
              <StarRating
                onRatingChange={(rating) => {
                  console.log(`⭐ Rating ${rating} for ${passenger.name}`)
                  setRatings((prevRatings) => {
                    // Remove existing rating for this user if it exists
                    const filteredRatings = prevRatings.filter(
                      (r) => r.userId !== passenger.id,
                    )
                    // Add the new rating
                    return [
                      ...filteredRatings,
                      { userId: passenger.id, rating },
                    ]
                  })
                }}
              />
              {ratings.some((r) => r.userId === passenger.id) && (
                <Text style={styles.ratedText}>✅ Rated</Text>
              )}
            </View>
          </View>
        </View>
      ))}
      <ActionButton
        onPress={handleRatingComplete}
        text={`Completar (${ratings.length}/${passengers.length})`}
        type="primary"
        disabled={ratings.length === 0}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    gap: 20,
    paddingTop: 20,
    backgroundColor: COLORS.dark_gray,
    paddingBottom: 40,
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 16,
  },
  passengerContainer: {
    marginHorizontal: 9,
    gap: 10,
  },
  passengerRatingContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  passengersInfo: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // backgroundColor: 'red',
    gap: 5,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratedText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: COLORS.gray_400,
    opacity: 0.6,
  },
})
