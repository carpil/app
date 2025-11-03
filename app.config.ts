import { ExpoConfig } from 'expo/config'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

const getUniqueIdentifier = () => {
  return 'com.carpil.carpil'
}

const getAppName = () => {
  return 'Carpil'
}

const getGoogleServicesFile = () => {
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
        apiKey: GOOGLE_MAPS_API_KEY,
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
          kotlinVersion: '2.0.21',
          gradleProperties: {
            kspVersion: '2.0.21-1.0.28',
          },
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
