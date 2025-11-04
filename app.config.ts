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
      NSCameraUsageDescription:
        'Carpil necesita acceso a tu cámara para que puedas tomar fotos de perfil y compartir imágenes con otros usuarios durante tus viajes compartidos.',
      NSPhotoLibraryUsageDescription:
        'Carpil necesita acceso a tu galería de fotos para que puedas seleccionar una foto de perfil y compartir imágenes relacionadas con tus viajes.',
      NSPhotoLibraryAddUsageDescription:
        'Carpil necesita permiso para guardar fotos en tu galería, como recibos de viajes o capturas importantes.',
      NSLocationWhenInUseUsageDescription:
        'Carpil necesita acceso a tu ubicación para mostrarte viajes disponibles cerca de ti, calcular rutas y facilitar puntos de encuentro con otros usuarios.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Carpil necesita acceso a tu ubicación para optimizar la experiencia de viajes compartidos, encontrar conductores cercanos y proporcionar actualizaciones en tiempo real durante tus trayectos.',
      NSLocationAlwaysUsageDescription:
        'Carpil necesita acceso continuo a tu ubicación para notificarte sobre viajes disponibles cerca de ti y proporcionar seguimiento en tiempo real durante los viajes activos.',
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
    targetSdkVersion: 35,
    compileSdkVersion: 35,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'POST_NOTIFICATIONS',
    ],
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
