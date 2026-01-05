import { View, StyleSheet } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { Shimmer } from './shimmer'

export default function ChatCardSkeleton() {
  return (
    <View style={styles.card}>
      <Shimmer>
        <View style={styles.dateSkeleton} />
      </Shimmer>

      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          <Shimmer>
            <View style={styles.mainAvatarSkeleton} />
          </Shimmer>
          <View style={styles.groupAvatars}>
            <Shimmer>
              <View style={styles.smallAvatarSkeleton} />
            </Shimmer>
            <Shimmer>
              <View style={styles.smallAvatarSkeleton} />
            </Shimmer>
            <Shimmer>
              <View style={styles.smallAvatarSkeleton} />
            </Shimmer>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Shimmer>
            <View style={styles.rideTextSkeleton} />
          </Shimmer>
          <Shimmer>
            <View style={styles.messageTextSkeleton} />
          </Shimmer>
        </View>

        <Shimmer>
          <View style={styles.badgeSkeleton} />
        </Shimmer>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  dateSkeleton: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 40,
    height: 10,
    backgroundColor: COLORS.gray_400,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 60,
    minWidth: 60,
    marginRight: 12,
  },
  mainAvatarSkeleton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray_400,
  },
  groupAvatars: {
    flexDirection: 'row',
    marginTop: -8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  smallAvatarSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray_400,
    marginLeft: -8,
  },
  textContainer: {
    flex: 1,
  },
  rideTextSkeleton: {
    width: 180,
    height: 14,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
    marginBottom: 4,
  },
  messageTextSkeleton: {
    width: 140,
    height: 13,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
  },
  badgeSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray_400,
    borderRadius: 10,
  },
})
