declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string
    EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID?: string
    EXPO_PUBLIC_CHAT_SECRET_KEY?: string
    EXPO_PUBLIC_FIRESTORE_DATABASE?: string
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?: string
    EXPO_PUBLIC_SENTRY_DSN?: string
    EXPO_PUBLIC_ENVIRONMENT?: string
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  }
}
