import { Platform } from 'react-native'

// Helper to get the correct localhost URL for Android
const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL

  // If environment variable is set, use it
  if (envUrl) {
    // If it's localhost and we're on Android, convert to 10.0.2.2
    if (
      Platform.OS === 'android' &&
      (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))
    ) {
      return envUrl.replace(/localhost|127\.0\.0\.1/, '10.0.2.2')
    }
    return envUrl
  }

  // Default fallback
  return ''
}

export const API_URL = `${getApiBaseUrl()}/v1`
export const IOS_GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID ?? ''
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''