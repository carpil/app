import { useMemo } from 'react'
import { usePathname, useSegments } from 'expo-router'
import { logger as baseLogger } from '@utils/logs'
import { Logger, LogOptions } from '~types/logger'

/**
 * Get a user-friendly screen name from route pathname
 */
function getScreenName(pathname: string, segments: string[]): string {
  // Remove leading slash and format
  const cleanPath = pathname.replace(/^\//, '')

  // If empty, it's the index route
  if (!cleanPath) {
    return 'HomeScreen'
  }

  // For tab routes
  if (segments[0] === '(tabs)') {
    const tabName = segments[1] || 'index'
    return `${capitalizeFirst(tabName)}Tab`
  }

  // For other routes, use the last segment
  const lastSegment = segments[segments.length - 1] || 'index'

  // Handle dynamic routes [id]
  const screenName = lastSegment
    .replace(/\[(\w+)\]/, '$1')
    .split('-')
    .map(capitalizeFirst)
    .join('')

  return `${screenName}Screen`
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * React hook that provides a logger with automatic screen context
 *
 * @param customScreenName - Optional custom screen name override
 * @returns Logger instance with screen context pre-filled
 *
 * @example
 * ```typescript
 * function ProfileScreen() {
 *   const log = useLogger()
 *
 *   useEffect(() => {
 *     log.info('Screen mounted', { action: 'screen_view' })
 *   }, [])
 *
 *   const handleSubmit = () => {
 *     log.info('Profile updated', { action: 'profile_update' })
 *   }
 * }
 * ```
 */
export function useLogger(customScreenName?: string): Logger {
  const pathname = usePathname()
  const segments = useSegments()

  const screenName = useMemo(() => {
    if (customScreenName) {
      return customScreenName
    }
    return getScreenName(pathname, segments)
  }, [customScreenName, pathname, segments])

  // Create a logger instance that automatically includes screen context
  const logger = useMemo<Logger>(() => {
    return {
      debug: (message: string, options?: LogOptions) => {
        baseLogger.debug(message, {
          ...options,
          screen: screenName,
        })
      },

      info: (message: string, options?: LogOptions) => {
        baseLogger.info(message, {
          ...options,
          screen: screenName,
        })
      },

      warn: (message: string, options?: LogOptions) => {
        baseLogger.warn(message, {
          ...options,
          screen: screenName,
        })
      },

      error: (message: string, options?: LogOptions) => {
        baseLogger.error(message, {
          ...options,
          screen: screenName,
        })
      },

      exception: (error: Error | unknown, options?: LogOptions) => {
        baseLogger.exception(error, {
          ...options,
          screen: screenName,
        })
      },

      startSpan: baseLogger.startSpan,
      setUser: baseLogger.setUser,
      addBreadcrumb: baseLogger.addBreadcrumb,
    }
  }, [screenName])

  return logger
}
