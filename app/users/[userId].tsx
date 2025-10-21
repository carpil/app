import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { getUserInfo } from 'services/api/user'
import { useAuthStore } from 'store/useAuthStore'
import { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import Screen from '@components/screen'
import { COLORS } from '@utils/constansts/colors'
import Avatar from '@components/avatar'
import { StarFilledIcon } from '@components/icons'
import { UserInfoResponse } from '~types/user'
import { formatDate } from '@utils/format-date'

export default function UserDetails() {
  const { userId } = useLocalSearchParams()
  const userIdParam = userId as string

  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = useAuthStore.getState().token
    if (!token) {
      return
    }
    const fetchUser = async () => {
      setLoading(true)
      const user = await getUserInfo(userIdParam)
      if (user) {
        setUser(user)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userIdParam])

  if (loading) {
    return (
      <Screen>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTintColor: COLORS.white,
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTitle: 'Detalles del usuario',
            headerBackTitle: 'Volver',
            headerBackVisible: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Cargando detalles del usuario...
          </Text>
        </View>
      </Screen>
    )
  }

  if (!user) {
    console.log('User not found')
    return null
  }

  return (
    <Screen backgroundColor={COLORS.dark_gray}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: COLORS.white,
          headerStyle: {
            backgroundColor: COLORS.dark_gray,
          },
          headerTitle: 'Detalles del usuario',
          headerBackTitle: 'Volver',
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        {/* User info */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.inactive_gray,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.gray_400,
          }}
        >
          <Avatar
            user={{
              id: user.userId,
              name: user.name,
              profilePicture: user.profilePicture,
            }}
            size={80}
          />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {user.name}
          </Text>
        </View>
        {/* Average rating */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.inactive_gray,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.gray_400,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {user.averageRating?.toFixed(1)}{' '}
            <StarFilledIcon color={COLORS.star_yellow} size={20} />
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
            }}
          >
            Calificación promedio
          </Text>
        </View>

        {/* Rides completed */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.inactive_gray,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.gray_400,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {user.ridesCompletedAsDriver === 0 &&
            user.ridesCompletedAsPassenger === 0
              ? '—'
              : user.ridesCompletedAsDriver > 0
                ? user.ridesCompletedAsDriver
                : user.ridesCompletedAsPassenger}
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {user.ridesCompletedAsDriver === 0 &&
            user.ridesCompletedAsPassenger === 0
              ? 'No tiene viajes completados'
              : user.ridesCompletedAsDriver > 0
                ? 'Viajes completados como conductor'
                : 'Viajes completados como pasajero'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.inactive_gray,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.gray_400,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {formatDate(user.joinedAt).dateText}
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
            }}
          >
            Miembro desde
          </Text>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  finishButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
