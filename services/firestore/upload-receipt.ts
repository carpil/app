import { getStorage, ref, getDownloadURL } from '@react-native-firebase/storage'

/**
 * Uploads a receipt image to Firebase Storage
 * @param imageUri - Local file URI from expo-image-picker
 * @param rideId - The ride ID
 * @param userId - The user ID
 * @returns The public download URL of the uploaded image
 */
export const uploadReceiptToStorage = async (
  imageUri: string,
  rideId: string,
  userId: string,
): Promise<string> => {
  try {
    // Get Firebase Storage instance
    const storage = getStorage()

    // Create a reference to the file location in Firebase Storage
    const filename = `${userId}`
    const storageRef = ref(
      storage,
      `rides/${rideId}/sinpe-payments/${filename}`,
    )

    // Upload the file (putFile is still a method on the reference)
    await storageRef.putFile(imageUri)

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    console.error('Error uploading receipt to Firebase Storage:', error)
    throw new Error('No se pudo subir el comprobante. Intenta nuevamente.')
  }
}
