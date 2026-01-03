import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import { StyledAlert } from '@components/styled-alert'
import { useLocalSearchParams, useRouter } from 'expo-router'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'
import { useEffect, useState } from 'react'
import { getRide } from 'services/api/rides'
import { Ride } from '~types/ride'
import { getUser, bootstrapMe } from 'services/api/user'
import { useAuthStore } from 'store/useAuthStore'
import { User } from '~types/user'
import Avatar from '@components/avatar'
import { formatCRC } from '@utils/currency'
import * as ImagePicker from 'expo-image-picker'
import { uploadReceiptToStorage } from 'services/firestore/upload-receipt'
import { completeSinpePayment } from 'services/api/payments'
import { useBootstrapStore } from 'store/useBootstrapStore'
import ActionButton from '@components/design-system/buttons/action-button'

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '($1) $2 $3')
}

export default function SinpeMovilPayment() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()
  const router = useRouter()

  const [ride, setRide] = useState<Ride | null>(null)
  const [driver, setDriver] = useState<User | null>(null)
  const [paymentImage, setPaymentImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { token, user } = useAuthStore((state) => state)
  const setBootstrap = useBootstrapStore((state) => state.setBootstrap)

  useEffect(() => {
    const fetchRide = async () => {
      const ride = await getRide(rideId)
      if (ride == null) {
        return
      }
      setRide(ride)

      const { driver: driverToSearch } = ride

      if (!driverToSearch || !token) {
        return
      }

      const driverResponse = await getUser(driverToSearch.id, token)
      if (driverResponse) {
        const { user } = driverResponse
        setDriver(user)
      }
    }
    fetchRide()
  }, [rideId, token])

  if (!ride || !driver) {
    return (
      <SafeScreen>
        <Text>Cargando...</Text>
      </SafeScreen>
    )
  }

  const formattedPrice = formatCRC(ride.price)

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Lo sentimos, necesitamos permisos para acceder a tus fotos.')
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setPaymentImage(result.assets[0].uri)
    }
  }

  const handleFinish = async () => {
    if (!paymentImage || !ride || !user) {
      StyledAlert.alert('Error', 'Por favor sube un comprobante de pago.')
      return
    }

    try {
      setIsProcessing(true)

      // Upload receipt to Firebase Storage
      const attachmentUrl = await uploadReceiptToStorage(
        paymentImage,
        rideId,
        user.id,
      )

      // Complete the SINPE payment
      const response = await completeSinpePayment({
        userId: user.id,
        rideId: rideId,
        amount: ride.price,
        description: `Pago por viaje de ${ride.origin?.name.primary} a ${ride.destination?.name.primary} - ${formatCRC(ride.price)}`,
        paymentMethod: 'sinpe',
        attachmentUrl: attachmentUrl,
      })

      if (!response || !response.success) {
        StyledAlert.alert(
          'Error',
          'No se pudo completar el pago. Intenta nuevamente.',
        )
        return
      }

      // Refresh bootstrap data to trigger modal switch
      const bootstrap = await bootstrapMe()
      if (bootstrap) {
        setBootstrap(bootstrap)
      }

      StyledAlert.alert(
        '¡Pago completado!',
        'Tu pago ha sido procesado exitosamente',
        [
          {
            text: 'Continuar',
            onPress: () => router.back(),
          },
        ],
      )
    } catch (error) {
      console.error('Error completing SINPE payment:', error)
      StyledAlert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al procesar el pago.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <Text style={styles.title}>Pago por SINPE Móvil</Text>
        {/* Add your SINPE Móvil payment form here */}
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
          <Avatar user={driver} size={80} />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {driver.name}
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
            {formatPhoneNumber(driver.phoneNumber ?? '')}
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
            }}
          >
            Número de teléfono
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
            {formattedPrice}
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
            }}
          >
            Precio del viaje
          </Text>
        </View>

        <TouchableOpacity
          onPress={pickImage}
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
          {paymentImage ? (
            <>
              <Image
                source={{ uri: paymentImage }}
                style={{
                  width: 56.25,
                  height: 100,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                Toca para cambiar
              </Text>
            </>
          ) : (
            <>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  backgroundColor: COLORS.dark_gray,
                  borderWidth: 2,
                  borderColor: COLORS.gray_400,
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 40,
                    fontWeight: 'bold',
                  }}
                >
                  +
                </Text>
              </View>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                Subir comprobante de pago
              </Text>
            </>
          )}
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 14,
            }}
          >
            Comprobante de transferencia
          </Text>
        </TouchableOpacity>

        <ActionButton
          onPress={handleFinish}
          text={`Pagar ${formattedPrice}`}
          type="primary"
          disabled={!paymentImage || isProcessing}
        />
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
