import { View, StyleSheet } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { Shimmer } from './shimmer'

export default function RideCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.pictureContainer}>
        <Shimmer>
          <View style={styles.avatarSkeleton} />
        </Shimmer>
        <View style={styles.passengersContainer}>
          <Shimmer>
            <View style={styles.passengerAvatarSkeleton} />
          </Shimmer>
          <Shimmer>
            <View style={styles.passengerAvatarSkeleton} />
          </Shimmer>
          <Shimmer>
            <View style={styles.passengerAvatarSkeleton} />
          </Shimmer>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.routeContainer}>
          <Shimmer>
            <View style={styles.routeTextSkeleton} />
          </Shimmer>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBlock}>
            <Shimmer>
              <View style={styles.infoTitleSkeleton} />
            </Shimmer>
            <Shimmer>
              <View style={styles.infoSubtitleSkeleton} />
            </Shimmer>
          </View>
          <View style={styles.infoBlock}>
            <Shimmer>
              <View style={styles.infoTitleSkeleton} />
            </Shimmer>
            <Shimmer>
              <View style={styles.infoSubtitleSkeleton} />
            </Shimmer>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderColor: COLORS.border_gray,
    backgroundColor: COLORS.inactive_gray,
    paddingVertical: 12,
    minHeight: 128,
    marginBottom: 8,
  },
  pictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 8,
  },
  avatarSkeleton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gray_400,
    marginBottom: 8,
  },
  passengersContainer: {
    flexDirection: 'row',
    marginTop: -8,
  },
  passengerAvatarSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray_400,
    marginTop: -10,
    marginLeft: -5,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
    marginHorizontal: 2,
    flex: 1,
  },
  routeTextSkeleton: {
    width: 200,
    height: 16,
    backgroundColor: COLORS.gray_400,
    borderRadius: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoTitleSkeleton: {
    width: 60,
    height: 18,
    backgroundColor: COLORS.gray_400,
    borderRadius: 4,
    marginBottom: 4,
  },
  infoSubtitleSkeleton: {
    width: 40,
    height: 14,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
  },
})
