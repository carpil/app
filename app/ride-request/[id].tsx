import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { formatDate } from '@utils/format-date'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Avatar from '@components/avatar'
import Screen from '@components/screen'
import { COLORS } from '@utils/constansts/colors'
import { useEffect, useState } from 'react'
import { getRideRequestById, deleteRideRequest } from 'services/api/ride-request'
import { RideRequest } from '~types/ride-request'
import SafeScreen from '@components/safe-screen'
import ActionButton from '@components/design-system/buttons/action-button'
import { useAuthStore } from 'store/useAuthStore'

export default function RideRequestDetails() {
  const { id } = useLocalSearchParams()
  const rideRequestId = id as string
  const [rideRequest, setRideRequest] = useState<RideRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const fetchRideRequest = async () => {
      try {
        setLoading(true)
        const data = await getRideRequestById(rideRequestId)
        setRideRequest(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar la solicitud de ride')
        console.error('Error fetching ride request:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRideRequest()
  }, [rideRequestId])

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Cargando detalles de la solicitud...
          </Text>
        </View>
      </Screen>
    )
  }

  if (error || !rideRequest) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🚗</Text>
          <Text style={styles.errorTitle}>Solicitud no encontrada</Text>
          <Text style={styles.errorMessage}>
            {error ||
              'La solicitud que buscas no existe o ya no está disponible.'}
          </Text>
        </View>
      </Screen>
    )
  }

  const { creator, origin, destination, departureDate } = rideRequest

  const { hour, date } = formatDate(departureDate)

  const isCreator = user?.id === creator.id

  const handleDeleteRideRequest = async () => {
    if (actionLoading) return
    Alert.alert(
      'Eliminar solicitud',
      '¿Estás seguro de que quieres eliminar esta solicitud de viaje? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true)
              const message = await deleteRideRequest(rideRequestId)
              if (message) {
                Alert.alert(
                  'Solicitud eliminada',
                  'La solicitud de viaje ha sido eliminada exitosamente',
                )
                router.back()
              } else {
                Alert.alert('Error', 'No se pudo eliminar la solicitud')
              }
            } catch (error) {
              console.error('Error deleting ride request:', error)
              Alert.alert('Error', 'Ocurrió un error al eliminar la solicitud')
            } finally {
              setActionLoading(false)
            }
          },
        },
      ],
    )
  }

  return (
    <SafeScreen>
      <ScrollView>
        <View style={styles.pictureContainer}>
          <Avatar user={creator} size={100} goToUserDetails={true} />
          <Text style={styles.creatorName}>{creator.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.card}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{origin?.name.primary}</Text>
              <Text style={styles.arrow}>➡️</Text>
              <Text style={styles.routeText}>{destination?.name.primary}</Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.card}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{hour}</Text>
                <Text style={styles.infoSubtitle}>{date}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>📍</Text>
                <Text style={styles.infoSubtitle}>Solicitud</Text>
              </View>
            </View>
          </View>
        </View>

        {isCreator && (
          <ActionButton
            onPress={handleDeleteRideRequest}
            text="Eliminar solicitud"
            type="secondary"
            disabled={actionLoading}
          />
        )}
      </ScrollView>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
  },
  pictureContainer: {
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  creatorName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    width: '100%',
    gap: 8,
  },
  subheading: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '100%',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 64,
  },
  routeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 24,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  infoBlock: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  infoTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    fontSize: 14,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray_400,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.gray_400,
    textAlign: 'center',
    marginTop: 5,
  },
})
