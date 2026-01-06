import { View, Text, StyleSheet, Alert } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import Avatar from '@components/avatar'
import { useAuthStore } from 'store/useAuthStore'
import StarRating from './star-rating'
import { useState } from 'react'
import { Rating } from '~types/rating'
import { UserInfo } from '~types/user'
import { useBootstrap } from 'hooks/useBootstrap'
import ActionButton from '@components/design-system/buttons/action-button'
import { logger } from '@utils/logs'

interface PassengersRatingProps {
  onComplete?: () => void
  onSaveRating: (rating: Rating | Rating[]) => Promise<void>
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

  const handleRatingComplete = async () => {
    if (ratings.length === 0) {
      logger.info('No ratings collected, skipping save', {
        action: 'passengers_rating_skip',
        metadata: { passengersCount: passengers.length },
      })
      Alert.alert('Completado', 'Has completado el proceso de calificación')
      onComplete?.()
      return
    }

    const ratingsToSave = ratings.map((rating) => ({
      targetUserId: rating.userId,
      rideId: rideId || '',
      rating: rating.rating,
      comment: '',
    }))

    logger.info('Completing passengers rating', {
      action: 'passengers_rating_complete',
      metadata: {
        collected: ratings.length,
        total: passengers.length,
      },
    })

    try {
      await onSaveRating(ratingsToSave)
      Alert.alert(
        '¡Gracias por tu opinión!',
        'Tus calificaciones han sido guardadas exitosamente',
      )
      onComplete?.()
    } catch (error) {
      logger.exception(error, {
        action: 'passengers_rating_save_error',
        metadata: { ratingsCount: ratingsToSave.length },
      })
      Alert.alert(
        'Error',
        'Ocurrió un error al guardar las calificaciones. Por favor, intenta nuevamente.',
      )
    }
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
                  setRatings((prevRatings) => {
                    const filteredRatings = prevRatings.filter(
                      (r) => r.userId !== passenger.id,
                    )
                    return [
                      ...filteredRatings,
                      { userId: passenger.id, rating },
                    ]
                  })
                }}
              />
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
  disabledButton: {
    backgroundColor: COLORS.gray_400,
    opacity: 0.6,
  },
})
