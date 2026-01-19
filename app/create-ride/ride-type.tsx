import { useContext, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { router } from 'expo-router'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import ActionButton from '@components/design-system/buttons/action-button'
import InteractiveModal from '@components/modal/interactive-modal'
import LocationCard from 'app/ride-navigation/components/location-card'
import Map from '@components/design-system/maps/map'

export default function RideType() {
  const { origin, destination, meetingPoint } = useContext(
    SelectLocationContext,
  )

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
      <InteractiveModal
        AlwaysVisible={
          <LocationCard origin={origin} destination={destination} />
        }
        Content={
          <View style={styles.contentBody}>
            <View style={styles.typeSelectionRow}>
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
                    selectedType === 'passenger' && styles.inactiveSubtitleBox,
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
            <ActionButton
              text="Continuar"
              type="primary"
              onPress={handleContinue}
              style={{ marginTop: 16 }}
            />
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBody: {
    gap: 16,
  },
  typeSelectionRow: {
    flexDirection: 'row',
    gap: 16,
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
  inactiveTypeBox: {
    borderColor: COLORS.gray_600,
    backgroundColor: COLORS.light_gray,
  },
  titleBox: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  inactiveTitleBox: {
    color: COLORS.gray_600,
  },
  subtitleBox: {
    fontSize: 12,
    color: COLORS.white_gray,
    textAlign: 'center',
  },
  inactiveSubtitleBox: {
    color: COLORS.gray_600,
  },
})
