import { router } from 'expo-router'
import { bootstrapMe } from 'services/api/user'
import { getRide } from 'services/api/rides'

interface NotificationData {
  url?: string
  [key: string]: any
}

/**
 * Extracts the ride ID from a URL path
 * Examples:
 * - /ride-navigation/123 -> 123
 * - /checkout/456 -> 456
 * - /ride/789 -> 789
 */
const extractRideIdFromPath = (path: string): string | null => {
  const match = path.match(/\/(ride-navigation|checkout|ride)\/([^\/]+)/)
  return match ? match[2] : null
}

/**
 * Determines the notification type based on the URL path
 */
const getNotificationType = (
  path: string,
): 'ride-starts' | 'ride-finished' | 'passenger-joins' | 'other' => {
  if (path.includes('/ride-navigation/')) return 'ride-starts'
  if (path.includes('/checkout/')) return 'ride-finished'
  if (path.includes('/ride/')) return 'passenger-joins'
  return 'other'
}

/**
 * Adjusts navigation based on current ride status and bootstrap data
 */
const adjustNavigationBasedOnStatus = async (
  intendedPath: string,
): Promise<string> => {
  const notificationType = getNotificationType(intendedPath)
  const rideId = extractRideIdFromPath(intendedPath)

  // If we can't determine the notification type or ride ID, return the intended path
  if (notificationType === 'other' || !rideId) {
    console.log('📍 No adjustment needed for path:', intendedPath)
    return intendedPath
  }

  try {
    // Fetch the latest bootstrap data to get the current state
    const bootstrap = await bootstrapMe()
    if (!bootstrap) {
      console.log('⚠️ Could not fetch bootstrap data, using intended path')
      return intendedPath
    }

    console.log('📊 Current bootstrap state:', {
      inRide: bootstrap.inRide,
      pendingPayment: bootstrap.pendingPayment,
      isDriver: bootstrap.isDriver,
      rideId: bootstrap.rideId,
    })

    // Handle each notification type
    switch (notificationType) {
      case 'ride-starts': {
        // Notification says "ride starts" but if there's a pending payment for this ride, go to checkout
        if (
          bootstrap.pendingPayment &&
          bootstrap.pendingPayment.rideId === rideId
        ) {
          console.log(
            '🔄 Adjusting navigation: Ride has pending payment, redirecting to checkout',
          )
          return `/checkout/${rideId}`
        }
        break
      }

      case 'ride-finished': {
        // Notification says "ride finished" but if user already paid (no pending payment), go home
        if (
          !bootstrap.pendingPayment ||
          bootstrap.pendingPayment.rideId !== rideId
        ) {
          console.log(
            '🔄 Adjusting navigation: Payment already completed, redirecting to home',
          )
          return '/(tabs)'
        }
        break
      }

      case 'passenger-joins': {
        // Notification says "passenger joins" but if ride already started, go to ride navigation
        if (bootstrap.inRide && bootstrap.rideId === rideId) {
          console.log(
            '🔄 Adjusting navigation: Ride already started, redirecting to ride navigation',
          )
          return `/ride-navigation/${rideId}`
        }

        // Additional check: fetch the ride to see if it has been completed
        const ride = await getRide(rideId)
        if (ride && ride.status === 'completed') {
          console.log(
            '🔄 Adjusting navigation: Ride completed, redirecting to checkout',
          )
          return `/checkout/${rideId}`
        }
        break
      }
    }

    console.log('✅ No adjustment needed, using intended path')
    return intendedPath
  } catch (error) {
    console.error('❌ Error adjusting navigation:', error)
    // In case of error, return the intended path as fallback
    return intendedPath
  }
}

export const handleNotificationNavigation = async (data: NotificationData) => {
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
    const intendedPath = url.replace(/^carpil:\/\//, '/')
    console.log(`🧭 Intended navigation path: ${intendedPath}`)

    // Adjust the path based on the current ride status
    const adjustedPath = await adjustNavigationBasedOnStatus(intendedPath)

    console.log(`🧭 Final navigation path: ${adjustedPath}`)
    router.push(adjustedPath as any)
  } catch (error) {
    console.error('❌ Error handling notification navigation:', error)
  }
}
