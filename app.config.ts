import { ExpoConfig } from 'expo/config'

const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.carpil.carpil.dev'
  }

  if (IS_PREVIEW) {
    return 'com.carpil.carpil.preview'
  }

  return 'com.carpil.carpil'
}

const getAppName = () => {
  if (IS_DEV) {
    return 'Carpil (Dev)'
  }

  if (IS_PREVIEW) {
    return 'Carpil (Preview)'
  }

  return 'Carpil'
}

const getGoogleServicesFile = () => {
  if (IS_PREVIEW) {
    return './google-services-preview.json'
  }

  return './google-services.json'
}

export default (config: ExpoConfig) => ({
  ...config,
  name: getAppName(),
  slug: 'carpil',
  scheme: 'carpil',
  owner: 'carpil',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      UIBackgroundModes: ['remote-notification'],
    },
    googleServicesFile: './GoogleService-Info.plist',
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: 'AIzaSyDf_V4LyxaXMmr_SbkVc8t84RQjvXhuNIc',
      },
    },
    package: getUniqueIdentifier(),
    googleServicesFile: getGoogleServicesFile(),
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    '@react-native-google-signin/google-signin',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-build-properties',
    'expo-apple-authentication',
    'expo-notifications',
    'expo-image-picker',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
        android: {
          kotlinVersion: '2.0.0',
        },
      },
    ],
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '9abf5b0c-6e77-4c03-8b56-a09e64fb244e',
    },
  },
})
