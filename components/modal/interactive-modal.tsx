import { COLORS } from '@utils/constansts/colors'
import { Modalize } from 'react-native-modalize'
import { Platform, View, StyleSheet } from 'react-native'
import { useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface InteractiveModalProps {
  collapsedHeight?: number
  AlwaysVisible: React.ReactNode
  Content: React.ReactNode
}
export default function InteractiveModal({
  collapsedHeight = 145,
  AlwaysVisible,
  Content,
}: InteractiveModalProps) {
  const modalizeRef = useRef<Modalize>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const insets = useSafeAreaInsets()

  const ANDROID_HEADER_HEIGHT = 56

  const snapPointHeight =
    Platform.OS === 'ios'
      ? insets.bottom + collapsedHeight
      : insets.bottom + collapsedHeight + 60

  const modalTopOffset =
    Platform.OS === 'ios' ? insets.top + 20 : ANDROID_HEADER_HEIGHT + 35

  const handlePositionChange = (position: 'top' | 'initial') => {
    setIsExpanded(position === 'top')
  }

  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={snapPointHeight}
      alwaysOpen={snapPointHeight}
      withHandle={isExpanded}
      handlePosition="inside"
      handleStyle={styles.expandedHandle}
      onPositionChange={handlePositionChange}
      modalStyle={styles.modalStyle}
      modalTopOffset={modalTopOffset}
    >
      <View style={styles.contentContainer}>
        {!isExpanded && <View style={styles.handle} />}
        <View>{AlwaysVisible}</View>
        {isExpanded && <View style={styles.expandableContent}>{Content}</View>}
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  expandedHandle: {
    top: 10,
    width: 40,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
  },
  modalStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
    elevation: 0,
    shadowOpacity: 0,
  },
  contentContainer: {
    gap: 12,
  },
  expandableContent: {
    backgroundColor: COLORS.dark_gray,
    borderRadius: 12,
    padding: 16,
  },
  handle: {
    width: 37,
    height: 5,
    backgroundColor: COLORS.gray_400,
    borderRadius: 3,
    alignSelf: 'center',
  },
})
