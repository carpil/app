import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import Avatar from '@components/avatar'
import { useAuthStore } from 'store/useAuthStore'
import StarRating from './star-rating'
import { useState } from 'react'

interface PassengersRatingProps {
  onComplete?: () => void
}

interface RatingComponentProps {
  userId: string
  rating: number
}

export default function PassengersRating({
  onComplete,
}: PassengersRatingProps) {
  const user = useAuthStore((state) => state.user)
  const [ratings, setRatings] = useState<RatingComponentProps[]>([])

  if (user == null) {
    return null
  }

  const handleRatingComplete = () => {
    console.log('ratings', ratings)
    // Call onComplete when rating is finished
    onComplete?.()
  }

  return (
    <>
      <Text style={styles.text}>{'¿Cómo calificarías a los pasajeros?'}</Text>
      <View style={styles.passengerContainer}>
        <View style={styles.passengerRatingContainer}>
          <Avatar user={user} size={48} />
          <View style={styles.passengersInfo}>
            <Text style={styles.name}>{user.name || 'Pepillo Figueres'}</Text>
            <StarRating
              onRatingChange={(rating) =>
                setRatings([{ userId: user.id, rating }])
              }
            />
          </View>
        </View>
        <View style={styles.passengerRatingContainer}>
          <Avatar user={user} size={48} />
          <View style={styles.passengersInfo}>
            <Text style={styles.name}>{user.name || 'Pepillo Figueres'}</Text>
            <StarRating
              onRatingChange={(rating) =>
                setRatings([{ userId: user.id, rating }])
              }
            />
          </View>
        </View>
        {Platform.OS === 'ios' && (
          <View style={styles.passengerRatingContainer}>
            <Avatar user={user} size={48} />
            <View style={styles.passengersInfo}>
              <Text style={styles.name}>{'Jose Rodolfo Rojas Guzman'}</Text>
              <StarRating
                onRatingChange={(rating) =>
                  setRatings([{ userId: user.id, rating }])
                }
              />
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleRatingComplete}
      >
        <Text style={styles.completeButtonText}>Complete Rating</Text>
      </TouchableOpacity>
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
})
