import { router } from 'expo-router'

interface NotificationData {
  url?: string
  [key: string]: any
}

export const handleNotificationNavigation = (data: NotificationData) => {
  console.log('🧭 Handling notification navigation with data:', data)

  if (!data || Object.keys(data).length === 0) {
    console.log('⚠️ No data in notification, skipping navigation')
    return
  }

  try {
    const { url } = data

    if (!url) {
      console.log('⚠️ No url property in notification data')
      return
    }

    // Remove the app scheme (carpil://) to get the path
    const path = url.replace(/^carpil:\/\//, '/')

    console.log(`🧭 Navigating to: ${path}`)
    
    // Use replace instead of push to avoid navigation stack issues on iOS
    // This ensures the home tab is in the navigation stack as a fallback
    router.replace(path as any)
  } catch (error) {
    console.error('❌ Error handling notification navigation:', error)
  }
}
