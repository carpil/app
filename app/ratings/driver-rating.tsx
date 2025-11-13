import { View, Text, StyleSheet } from 'react-native'
import Avatar from '@components/avatar'
import StarRating from './star-rating'
import { useState } from 'react'
import { UserInfo } from '~types/user'
import { COLORS } from '@utils/constansts/colors'
import { Rating } from '~types/rating'
import { useBootstrap } from 'hooks/useBootstrap'
import ActionButton from '@components/design-system/buttons/action-button'

interface DriverRatingProps {
  user: UserInfo
  onNext?: () => void
  onSaveRating: (rating: Rating) => void
  hasOtherPassengers?: boolean
}

export default function DriverRating({
  user,
  onNext,
  onSaveRating,
  hasOtherPassengers = false,
}: DriverRatingProps) {
  const [rating, setRating] = useState(0)

  const { rideId } = useBootstrap()

  const handleCompleteRating = () => {
    onSaveRating({
      targetUserId: user.id,
      rideId: rideId || '',
      rating,
      comment: '',
    })
    onNext?.()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{'¿Cómo calificarías a este conductor?'}</Text>
      <View style={styles.driverContainer}>
        <Avatar
          user={{
            id: user.id,
            name: user.name,
            profilePicture: user.profilePicture,
          }}
        />
        <View>
          <Text style={styles.name}>{user.name || 'Pepillo Figueres'}</Text>
        </View>
      </View>
      <StarRating onRatingChange={setRating} />
      <ActionButton
        onPress={handleCompleteRating}
        text={hasOtherPassengers ? 'Siguiente' : 'Completar'}
        type={hasOtherPassengers ? 'secondary' : 'primary'}
        disabled={!rating}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    gap: 20,
    paddingTop: 20,
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
  driverContainer: {
    alignItems: 'center',
    gap: 10,
  },
  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
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
