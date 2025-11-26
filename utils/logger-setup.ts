import * as Sentry from '@sentry/react-native'
import crashlytics from '@react-native-firebase/crashlytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { LoggerConfig } from '~types/logger'

const SAMPLING_KEY = '@logger_sampling_enabled'
const SESSION_START_KEY = '@logger_session_start'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

class LoggerSetup {
  private config: LoggerConfig | null = null
  private samplingEnabled: boolean = false
  private isInitialized: boolean = false

  /**
   * Initialize the logger with global configuration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const isDevelopment = __DEV__
      const appVersion = Constants.expoConfig?.version || '1.0.0'
      const environment = isDevelopment ? 'development' : 'production'

      this.config = {
        enableSampling: !isDevelopment, // Only enable sampling in production
        samplingRate: 0.1, // 10% of sessions
        isDevelopment,
        appVersion,
        environment,
        platform: Platform.OS,
      }

      // Set up sampling for production
      if (this.config.enableSampling) {
        await this.setupSampling()
      } else {
        // In development, always enable full logging to console
        this.samplingEnabled = false
      }

      // Set global tags for Sentry
      Sentry.setTag('environment', environment)
      Sentry.setTag('app_version', appVersion)
      Sentry.setTag('platform', Platform.OS)

      // Set global attributes for Crashlytics
      await crashlytics().setAttribute('environment', environment)
      await crashlytics().setAttribute('app_version', appVersion)
      await crashlytics().setAttribute('platform', Platform.OS)

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize logger:', error)
    }
  }

  /**
   * Set up sampling strategy for production logging
   * Determines if this session should send all logs or only WARN/ERROR
   */
  private async setupSampling(): Promise<void> {
    try {
      const sessionStart = await AsyncStorage.getItem(SESSION_START_KEY)
      const now = Date.now()

      // Check if we have an active session
      if (sessionStart) {
        const sessionAge = now - parseInt(sessionStart, 10)

        // If session is still valid, use existing sampling decision
        if (sessionAge < SESSION_DURATION) {
          const samplingValue = await AsyncStorage.getItem(SAMPLING_KEY)
          this.samplingEnabled = samplingValue === 'true'
          return
        }
      }

      // New session - make sampling decision
      this.samplingEnabled = Math.random() < (this.config?.samplingRate || 0.1)

      // Store the decision
      await AsyncStorage.setItem(SAMPLING_KEY, this.samplingEnabled.toString())
      await AsyncStorage.setItem(SESSION_START_KEY, now.toString())

      console.log(
        `[Logger] New session started. Full logging: ${this.samplingEnabled}`,
      )
    } catch (error) {
      console.error('Failed to set up sampling:', error)
      this.samplingEnabled = false
    }
  }

  /**
   * Set user identification in both Sentry and Crashlytics
   */
  async setUser(
    userId: string | null,
    userEmail?: string,
    userName?: string,
  ): Promise<void> {
    try {
      if (userId) {
        // Set user in Sentry
        Sentry.setUser({
          id: userId,
          email: userEmail,
          username: userName,
        })

        // Set user in Crashlytics
        await crashlytics().setUserId(userId)
        if (userEmail) {
          await crashlytics().setAttribute('user_email', userEmail)
        }
        if (userName) {
          await crashlytics().setAttribute('user_name', userName)
        }
      } else {
        // Clear user
        Sentry.setUser(null)
        await crashlytics().setUserId('')
      }
    } catch (error) {
      console.error('Failed to set user:', error)
    }
  }

  /**
   * Add a breadcrumb for tracking user actions
   */
  addBreadcrumb(
    message: string,
    category: string,
    data?: Record<string, any>,
  ): void {
    try {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
        timestamp: Date.now() / 1000,
      })

      // Crashlytics also supports breadcrumbs via log
      crashlytics().log(`[${category}] ${message}`)
    } catch (error) {
      console.error('Failed to add breadcrumb:', error)
    }
  }

  /**
   * Check if full logging should be enabled for this session
   * In development: returns false (console only)
   * In production: returns true if this session is sampled OR for WARN/ERROR levels
   */
  shouldSendToServices(level: 'debug' | 'info' | 'warning' | 'error'): boolean {
    // Development: never send to services
    if (this.config?.isDevelopment) {
      return false
    }

    // Production: always send WARN and ERROR
    if (level === 'warning' || level === 'error') {
      return true
    }

    // Production: send DEBUG and INFO only if sampled
    return this.samplingEnabled
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig | null {
    return this.config
  }

  /**
   * Check if logger is initialized
   */
  isReady(): boolean {
    return this.isInitialized
  }
}

// Export singleton instance
export const loggerSetup = new LoggerSetup()
