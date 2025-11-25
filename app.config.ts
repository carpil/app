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
    config: {
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    },
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      UIBackgroundModes: ['remote-notification', 'location'],
      NSLocationWhenInUseUsageDescription:
        'Carpil needs your location to show nearby rides and provide accurate pickup and drop-off services.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Carpil needs your location to track your ride in real-time and provide navigation even when the app is in the background.',
      NSCameraUsageDescription:
        'Carpil needs access to your camera so you can take photos for your profile picture.',
      NSPhotoLibraryUsageDescription:
        'Carpil needs access to your photo library so you can select photos for your profile picture.',
    },
    googleServicesFile: './GoogleService-Info.plist',
    usesAppleSignIn: true,
    icon: {
      light: './assets/icons/ios-light.png',
      dark: './assets/icons/ios-dark.png',
      tinted: './assets/icons/ios-tinted.png',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/android-icon.png',
      backgroundImage: './assets/icons/android-icon.png',
      monochromeImage: './assets/icons/android-icon.png',
      backgroundColor: '#1F2937',
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
    '@react-native-firebase/crashlytics',
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
    [
      'expo-splash-screen',
      {
        image: './assets/splash/splash-icon-light.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          image: './assets/splash/splash-icon-dark.png',
          resizeMode: 'contain',
          backgroundColor: '#1F2937',
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
