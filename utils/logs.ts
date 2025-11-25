import * as Sentry from '@sentry/react-native'
import crashlytics from '@react-native-firebase/crashlytics'
import { useAuthStore } from 'store/useAuthStore'
import { loggerSetup } from './logger-setup'
import {
  Logger,
  LogOptions,
  LogContext,
  LogSpan,
  LogMetadata,
  LogLevel,
} from '~types/logger'

function buildLogContext(options?: LogOptions): LogContext {
  const user = useAuthStore.getState().user
  const config = loggerSetup.getConfig()

  const context: LogContext = {
    timestamp: new Date().toISOString(),
    environment: config?.environment,
    appVersion: config?.appVersion,
    platform: config?.platform,
  }

  // Add user information if available
  if (user) {
    context.userId = user.id
    context.userEmail = user.email
    context.userName = user.name
  }

  // Add optional context from options
  if (options?.screen) {
    context.screen = options.screen
  }

  if (options?.action) {
    context.action = options.action
  }

  if (options?.metadata) {
    context.metadata = options.metadata
  }

  return context
}

/**
 * Format log message for console output
 */
function formatConsoleMessage(
  level: LogLevel,
  message: string,
  context: LogContext,
): string {
  const emoji = {
    [LogLevel.DEBUG]: '🐛',
    [LogLevel.INFO]: 'ℹ️',
    [LogLevel.WARN]: '⚠️',
    [LogLevel.ERROR]: '❌',
  }[level]

  const parts = [emoji, message]

  if (context.screen) {
    parts.push(`[${context.screen}]`)
  }

  if (context.action) {
    parts.push(`{${context.action}}`)
  }

  if (context.userId) {
    parts.push(`(user: ${context.userId})`)
  }

  return parts.join(' ')
}

/**
 * Send log to Sentry with full context
 */
function sendToSentry(
  level: LogLevel,
  message: string,
  context: LogContext,
  error?: Error | unknown,
): void {
  try {
    if (error && error instanceof Error) {
      // For actual errors, capture exception
      Sentry.captureException(error, {
        level,
        tags: {
          screen: context.screen,
          action: context.action,
        },
        contexts: {
          log_context: context as any,
        },
      })
    } else {
      // For messages, capture message with context
      Sentry.captureMessage(message, {
        level,
        tags: {
          screen: context.screen,
          action: context.action,
        },
        contexts: {
          log_context: context as any,
        },
      })
    }
  } catch (err) {
    console.error('Failed to send to Sentry:', err)
  }
}

/**
 * Send log to Firebase Crashlytics
 */
function sendToCrashlytics(
  level: LogLevel,
  message: string,
  context: LogContext,
  error?: Error | unknown,
): void {
  try {
    const logMessage = `[${level.toUpperCase()}] ${message} ${JSON.stringify({
      screen: context.screen,
      action: context.action,
      userId: context.userId,
    })}`

    crashlytics().log(logMessage)

    // If it's an error, also record it as a non-fatal error
    if (error && error instanceof Error) {
      crashlytics().recordError(error)
    }
  } catch (err) {
    console.error('Failed to send to Crashlytics:', err)
  }
}

/**
 * Core logging function
 */
export function log(
  level: LogLevel,
  message: string,
  options?: LogOptions,
): void {
  try {
    const context = buildLogContext(options)
    const consoleMessage = formatConsoleMessage(level, message, context)

    // Always log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(consoleMessage, context.metadata || '')
        break
      case LogLevel.INFO:
        console.info(consoleMessage, context.metadata || '')
        break
      case LogLevel.WARN:
        console.warn(consoleMessage, context.metadata || '')
        break
      case LogLevel.ERROR:
        console.error(consoleMessage, context.metadata || '')
        break
    }

    // Check if we should send to external services
    if (loggerSetup.shouldSendToServices(level)) {
      sendToSentry(level, message, context, options?.error)
      sendToCrashlytics(level, message, context, options?.error)
    }
  } catch (error) {
    // Never let logging crash the app
    console.error('Logger failed:', error)
  }
}

/**
 * Main logger instance
 */
export const logger: Logger = {
  /**
   * Debug level logging - for development troubleshooting
   */
  debug(message: string, options?: LogOptions): void {
    log(LogLevel.DEBUG, message, options)
  },

  /**
   * Info level logging - for general information
   */
  info(message: string, options?: LogOptions): void {
    log(LogLevel.INFO, message, options)
  },

  /**
   * Warning level logging - for concerning but non-critical issues
   */
  warn(message: string, options?: LogOptions): void {
    log(LogLevel.WARN, message, options)
  },

  /**
   * Error level logging - for errors that need attention
   */
  error(message: string, options?: LogOptions): void {
    log(LogLevel.ERROR, message, options)
  },

  /**
   * Exception logging - specifically for caught exceptions
   */
  exception(error: Error | unknown, options?: LogOptions): void {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred'
    log(LogLevel.ERROR, message, { ...options, error })
  },

  /**
   * Start a performance span for tracking operations
   */
  startSpan(
    operation: string,
    description?: string,
    data?: LogMetadata,
  ): LogSpan {
    const startTime = Date.now()

    try {
      // Log start in Crashlytics
      crashlytics().log(
        `[SPAN_START] ${operation}: ${description || ''} ${JSON.stringify(data || {})}`,
      )

      // Start Sentry span
      Sentry.startSpan(
        {
          name: description || operation,
          op: operation,
        },
        () => {
          // Span is active within this callback
        },
      )
    } catch (error) {
      console.error('Failed to start span:', error)
    }

    return {
      finish(finishData?: LogMetadata): void {
        try {
          const duration = Date.now() - startTime

          // Log completion in Crashlytics
          crashlytics().log(
            `[SPAN_END] ${operation} (${duration}ms) ${JSON.stringify(finishData || {})}`,
          )

          // Add breadcrumb for the completed operation
          logger.addBreadcrumb(`${operation} completed`, 'performance', {
            ...data,
            ...finishData,
            duration,
          })
        } catch (error) {
          console.error('Failed to finish span:', error)
        }
      },
    }
  },

  /**
   * Set user identification
   */
  setUser(userId: string | null, userEmail?: string, userName?: string): void {
    loggerSetup.setUser(userId, userEmail, userName)
  },

  /**
   * Add a breadcrumb for user action tracking
   */
  addBreadcrumb(message: string, category: string, data?: LogMetadata): void {
    loggerSetup.addBreadcrumb(message, category, data)
  },
}

/**
 * Initialize the logger system
 * Should be called once at app startup
 */
export async function initializeLogger(): Promise<void> {
  await loggerSetup.initialize()
}

// Export types for convenience
export type { Logger, LogOptions, LogContext, LogSpan, LogMetadata }
export { LogLevel }
