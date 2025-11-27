import { useContext, useRef, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { Modalize } from 'react-native-modalize'
import { router } from 'expo-router'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Platform, Text, Pressable } from 'react-native'
import { LocationIcon } from '@components/icons'
import ActionButton from '@components/design-system/buttons/action-button'
import Map from '@components/design-system/maps/map'

export default function RideType() {
  const { origin, destination, meetingPoint } = useContext(
    SelectLocationContext,
  )
  const modalizeRef = useRef<Modalize>(null)

  const [selectedType, setSelectedType] = useState<'driver' | 'passenger'>(
    'driver',
  )

  const handleSelectType = (type: 'driver' | 'passenger') => {
    setSelectedType(type)
  }

  if (!origin || !destination) {
    return null
  }

  const handleContinue = () => {
    if (selectedType === 'driver') {
      router.push('/create-ride/select-meeting-point')
    } else {
      router.push('/create-ride/ride-request-overview')
    }
  }
  return (
    <View style={styles.container}>
      <Map
        origin={origin}
        destination={destination}
        meetingPoint={meetingPoint ?? undefined}
      />

      <Modalize
        ref={modalizeRef}
        alwaysOpen={Platform.OS === 'ios' ? 350 : 350}
        modalStyle={{
          backgroundColor: 'transparent',
          marginHorizontal: 20,
        }}
        modalTopOffset={Platform.OS === 'ios' ? 400 : 200}
        avoidKeyboardLikeIOS={true}
      >
        <View>
          <View
            style={{
              backgroundColor: COLORS.dark_gray,
              padding: 15,
              borderRadius: 10,
              gap: 16,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.primary} />
              <View>
                <Text style={styles.locationTitle}>{origin.name.primary}</Text>
                <Text style={styles.locationSubtitle}>
                  {origin.name.secondary}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LocationIcon color={COLORS.secondary} />
              <View>
                <Text style={styles.locationTitle}>
                  {destination.name.primary}
                </Text>
                <Text style={styles.locationSubtitle}>
                  {destination.name.secondary}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              backgroundColor: COLORS.dark_gray,
              padding: 15,
              borderRadius: 10,
              // gap: 16,
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <Pressable
                  style={[
                    styles.typeBox,
                    selectedType === 'passenger' && styles.inactiveTypeBox,
                  ]}
                  onPress={() => handleSelectType('driver')}
                >
                  <Text
                    style={[
                      styles.titleBox,
                      selectedType === 'passenger' && styles.inactiveTitleBox,
                    ]}
                  >
                    Ofrecer ride
                  </Text>
                  <Text
                    style={[
                      styles.subtitleBox,
                      selectedType === 'passenger' &&
                        styles.inactiveSubtitleBox,
                    ]}
                  >
                    Tengo auto y quiero compartir mi viaje.
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.typeBox,
                    selectedType === 'driver' && styles.inactiveTypeBox,
                  ]}
                  onPress={() => handleSelectType('passenger')}
                >
                  <Text
                    style={[
                      styles.titleBox,
                      selectedType === 'driver' && styles.inactiveTitleBox,
                    ]}
                  >
                    Pedir ride
                  </Text>
                  <Text
                    style={[
                      styles.subtitleBox,
                      selectedType === 'driver' && styles.inactiveSubtitleBox,
                    ]}
                  >
                    Necesito transporte para mi viaje.
                  </Text>
                </Pressable>
              </View>
            </View>
            <ActionButton
              text="Continuar"
              type="primary"
              onPress={handleContinue}
            />
          </View>
        </View>
      </Modalize>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitleBox: {
    fontSize: 12,
    color: COLORS.white_gray,
    textAlign: 'center',
  },
  inactiveTypeBox: {
    borderColor: COLORS.gray_600,
    backgroundColor: COLORS.light_gray,
  },
  inactiveTitleBox: {
    color: COLORS.gray_600,
  },
  inactiveSubtitleBox: {
    color: COLORS.gray_600,
  },
  map: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.dark_gray,
  },
  containerLocations: {
    flex: 1,
    marginHorizontal: 30,
    gap: 20,
    paddingTop: 20,
    backgroundColor: COLORS.dark_gray,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
  locationTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationSubtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentMethodsContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
  },
  buttonText: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  buttonActive: {
    borderColor: COLORS.secondary,
    borderWidth: 2,
  },
  buttonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.gray_600,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButtonTextDisabled: {
    color: COLORS.gray_400,
  },
  typeBox: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    backgroundColor: COLORS.light_gray,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
})
