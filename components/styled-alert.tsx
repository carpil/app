import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native'
import { COLORS } from '@utils/constansts/colors'

export interface AlertButton {
  text: string
  onPress?: () => void
  style?: 'default' | 'cancel' | 'destructive'
}

interface AlertState {
  visible: boolean
  title: string
  message?: string
  buttons: AlertButton[]
}

let alertQueue: AlertState[] = []
let setCurrentAlert: React.Dispatch<React.SetStateAction<AlertState | null>> | null = null

export const StyledAlert = {
  alert: (
    title: string,
    message?: string,
    buttons: AlertButton[] = [{ text: 'OK' }],
  ) => {
    const newAlert: AlertState = {
      visible: true,
      title,
      message,
      buttons,
    }

    if (setCurrentAlert) {
      alertQueue.push(newAlert)
      if (alertQueue.length === 1) {
        setCurrentAlert(newAlert)
      }
    }
  },
}

export const StyledAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAlert, _setCurrentAlert] = useState<AlertState | null>(null)

  useEffect(() => {
    setCurrentAlert = _setCurrentAlert
    return () => {
      setCurrentAlert = null
    }
  }, [])

  const handleClose = () => {
    alertQueue.shift()
    if (alertQueue.length > 0) {
      _setCurrentAlert(alertQueue[0])
    } else {
      _setCurrentAlert(null)
    }
  }

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress()
    }
    handleClose()
  }

  return (
    <>
      {children}
      <Modal
        visible={currentAlert !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable style={styles.alertContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.alertContent}>
              {/* Title */}
              <Text style={styles.title}>{currentAlert?.title}</Text>

              {/* Message */}
              {currentAlert?.message && (
                <Text style={styles.message}>{currentAlert.message}</Text>
              )}

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {currentAlert?.buttons.map((button, index) => {
                  const isCancel = button.style === 'cancel'
                  const isDestructive = button.style === 'destructive'
                  const isLast = index === currentAlert.buttons.length - 1

                  return (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.button,
                        isCancel && styles.cancelButton,
                        isDestructive && styles.destructiveButton,
                        !isLast && styles.buttonWithBorder,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={() => handleButtonPress(button)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          isCancel && styles.cancelButtonText,
                          isDestructive && styles.destructiveButtonText,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const { width } = Dimensions.get('window')
const alertWidth = Math.min(width * 0.85, 340)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: alertWidth,
    maxWidth: '90%',
  },
  alertContent: {
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  message: {
    fontSize: 15,
    color: COLORS.gray_400,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 22,
  },
  buttonsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray_600,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray_600,
  },
  buttonPressed: {
    backgroundColor: COLORS.gray_600,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cancelButton: {
    // No additional styling needed
  },
  cancelButtonText: {
    fontWeight: '700',
    color: COLORS.white,
  },
  destructiveButton: {
    // No additional styling needed
  },
  destructiveButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
})
