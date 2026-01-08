import CryptoJS from 'crypto-js'
import { logger } from './logs'

const secretKey = process.env.EXPO_PUBLIC_CHAT_SECRET_KEY ?? ''

export const decryptMessage = (ciphertext: string): string => {
  if (!secretKey) {
    logger.error('Chat secret key not configured', {
      action: 'decrypt_message_no_key',
      metadata: { hasCiphertext: !!ciphertext },
    })
    return ciphertext
  }

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)

    if (!decrypted || decrypted.length === 0) {
      logger.error('Decryption resulted in empty string', {
        action: 'decrypt_message_empty',
        metadata: {
          ciphertextLength: ciphertext?.length ?? 0,
          hasSecretKey: !!secretKey,
        },
      })
      return ciphertext
    }

    return decrypted
  } catch (error) {
    logger.error('Error decrypting message', {
      action: 'decrypt_message_error',
      metadata: {
        error: (error as Error).message,
        ciphertextLength: ciphertext?.length ?? 0,
      },
    })
    return ciphertext
  }
}
