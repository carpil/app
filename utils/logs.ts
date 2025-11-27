import * as Sentry from '@sentry/react-native'
import { getCrashlytics } from '@react-native-firebase/crashlytics'
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

  if (user) {
    context.userId = user.id
    context.userEmail = user.email
    context.userName = user.name
  }

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

function sendToSentry(
  level: LogLevel,
  message: string,
  context: LogContext,
  error?: Error | unknown,
): void {
  try {
    if (error && error instanceof Error) {
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

function sendToCrashlytics(
  level: LogLevel,
  message: string,
  context: LogContext,
  error?: Error | unknown,
): void {
  try {
    const crashlytics = getCrashlytics()
    const logMessage = `[${level.toUpperCase()}] ${message} ${JSON.stringify({
      screen: context.screen,
      action: context.action,
      userId: context.userId,
    })}`

    crashlytics.log(logMessage)

    if (error && error instanceof Error) {
      crashlytics.recordError(error)
    }
  } catch (err) {
    console.error('Failed to send to Crashlytics:', err)
  }
}

export function log(
  level: LogLevel,
  message: string,
  options?: LogOptions,
): void {
  try {
    const context = buildLogContext(options)
    const consoleMessage = formatConsoleMessage(level, message, context)

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

    if (loggerSetup.shouldSendToServices(level)) {
      sendToSentry(level, message, context, options?.error)
      sendToCrashlytics(level, message, context, options?.error)
    }
  } catch (error) {
    console.error('Logger failed:', error)
  }
}

export const logger: Logger = {
  debug(message: string, options?: LogOptions): void {
    log(LogLevel.DEBUG, message, options)
  },

  info(message: string, options?: LogOptions): void {
    log(LogLevel.INFO, message, options)
  },

  warn(message: string, options?: LogOptions): void {
    log(LogLevel.WARN, message, options)
  },

  error(message: string, options?: LogOptions): void {
    log(LogLevel.ERROR, message, options)
  },

  exception(error: Error | unknown, options?: LogOptions): void {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred'
    log(LogLevel.ERROR, message, { ...options, error })
  },

  startSpan(
    operation: string,
    description?: string,
    data?: LogMetadata,
  ): LogSpan {
    const startTime = Date.now()

    try {
      const crashlytics = getCrashlytics()
      crashlytics.log(
        `[SPAN_START] ${operation}: ${description || ''} ${JSON.stringify(data || {})}`,
      )

      Sentry.startSpan(
        {
          name: description || operation,
          op: operation,
        },
        () => {},
      )
    } catch (error) {
      console.error('Failed to start span:', error)
    }

    return {
      finish(finishData?: LogMetadata): void {
        try {
          const crashlytics = getCrashlytics()
          const duration = Date.now() - startTime

          crashlytics.log(
            `[SPAN_END] ${operation} (${duration}ms) ${JSON.stringify(finishData || {})}`,
          )

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

  setUser(userId: string | null, userEmail?: string, userName?: string): void {
    loggerSetup.setUser(userId, userEmail, userName)
  },

  addBreadcrumb(message: string, category: string, data?: LogMetadata): void {
    loggerSetup.addBreadcrumb(message, category, data)
  },
}

export async function initializeLogger(): Promise<void> {
  await loggerSetup.initialize()
}

export type { Logger, LogOptions, LogContext, LogSpan, LogMetadata }
export { LogLevel }
