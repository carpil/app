import { Platform } from 'react-native'

const getApiBaseUrl = () => {
  const envUrl = (process.env as any).EXPO_PUBLIC_API_URL

  if (envUrl) {
    const isAndroid = Platform.OS === 'android'
    const isLocalhost =
      envUrl.includes('localhost') || envUrl.includes('127.0.0.1')

    if (isAndroid && isLocalhost) {
      return envUrl.replace(/localhost|127\.0\.0\.1/, '10.0.2.2')
    }
    return envUrl
  }

  return ''
}

export const API_URL = `${getApiBaseUrl()}/v1`
export const IOS_GOOGLE_CLIENT_ID =
  (process.env as any).EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID ?? ''
export const STRIPE_PUBLISHABLE_KEY =
  (process.env as any).EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
export const SENTRY_DSN =
  'https://ee0a00d649ff648e78f5733528e53a72@o4510399716392960.ingest.us.sentry.io/4510399717310464'
