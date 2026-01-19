import * as Sentry from '@sentry/react-native'
import { getCrashlytics } from '@react-native-firebase/crashlytics'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { LoggerConfig, LogLevel } from '~types/logger'

const SAMPLING_KEY = '@logger_sampling_enabled'
const SESSION_START_KEY = '@logger_session_start'
const SESSION_DURATION = 24 * 60 * 60 * 1000

const environment =
  (process.env as any).EXPO_PUBLIC_ENVIRONMENT ?? 'development'

class LoggerSetup {
  private config: LoggerConfig | null = null
  private samplingEnabled: boolean = false
  private isInitialized: boolean = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const isDevelopment = environment === 'development'
      const appVersion = Constants.expoConfig?.version ?? '1.0.0'

      this.config = {
        enableSampling: !isDevelopment, // Only enable sampling in production
        samplingRate: 0.1, // 10% of sessions
        isDevelopment,
        appVersion,
        environment,
        platform: Platform.OS,
      }

      if (this.config.enableSampling) {
        await this.setupSampling()
      } else {
        this.samplingEnabled = false
      }

      Sentry.setTag('environment', environment)
      Sentry.setTag('app_version', appVersion)
      Sentry.setTag('platform', Platform.OS)

      const crashlytics = getCrashlytics()
      crashlytics.setAttributes({
        environment,
        app_version: appVersion,
        platform: Platform.OS,
      })

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

  async setUser(
    userId: string | null,
    userEmail?: string,
    userName?: string,
  ): Promise<void> {
    try {
      const crashlytics = getCrashlytics()

      if (userId) {
        Sentry.setUser({
          id: userId,
          email: userEmail,
          username: userName,
        })

        crashlytics.setUserId(userId)

        const attributes: Record<string, string> = {}
        if (userEmail) {
          attributes.user_email = userEmail
        }
        if (userName) {
          attributes.user_name = userName
        }
        if (Object.keys(attributes).length > 0) {
          crashlytics.setAttributes(attributes)
        }
      } else {
        Sentry.setUser(null)
        crashlytics.setUserId('')
      }
    } catch (error) {
      console.error('Failed to set user:', error)
    }
  }

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

      const crashlytics = getCrashlytics()
      crashlytics.log(`[${category}] ${message}`)
    } catch (error) {
      console.error('Failed to add breadcrumb:', error)
    }
  }

  shouldSendToServices(level: LogLevel): boolean {
    if (this.config?.isDevelopment) {
      return false
    }

    if (level === LogLevel.WARN || level === LogLevel.ERROR) {
      return true
    }

    return this.samplingEnabled
  }

  getConfig(): LoggerConfig | null {
    return this.config
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

export const loggerSetup = new LoggerSetup()
