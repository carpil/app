import CryptoJS from 'crypto-js'

const secretKey = process.env.EXPO_PUBLIC_CHAT_SECRET_KEY ?? ''

export const encryptMessage = (plaintext: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(plaintext, secretKey)
    return encrypted.toString()
  } catch (error) {
    console.error('Error encrypting message:', error)
    return plaintext
  }
}

export const decryptMessage = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Error decrypting message:', error)
    return ciphertext
  }
}
