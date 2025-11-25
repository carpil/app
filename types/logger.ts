/**
 * Logger Type Definitions
 * Comprehensive types for the professional logging system
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warning',
  ERROR = 'error',
}

/**
 * Flexible metadata object for additional context
 */
export interface LogMetadata {
  [key: string]: any
}

/**
 * Context information attached to each log
 */
export interface LogContext {
  screen?: string
  action?: string
  userId?: string
  userEmail?: string
  userName?: string
  timestamp?: string
  environment?: string
  appVersion?: string
  platform?: string
  metadata?: LogMetadata
}

/**
 * Options for logging methods
 */
export interface LogOptions {
  screen?: string
  action?: string
  metadata?: LogMetadata
  error?: Error | unknown
}

/**
 * Span/Transaction options for performance tracing
 */
export interface SpanOptions {
  operation: string
  description?: string
  data?: LogMetadata
}

/**
 * Span interface for performance tracking
 */
export interface LogSpan {
  finish: (data?: LogMetadata) => void
}

/**
 * Main logger interface
 */
export interface Logger {
  debug: (message: string, options?: LogOptions) => void
  info: (message: string, options?: LogOptions) => void
  warn: (message: string, options?: LogOptions) => void
  error: (message: string, options?: LogOptions) => void
  exception: (error: Error | unknown, options?: LogOptions) => void
  startSpan: (
    operation: string,
    description?: string,
    data?: LogMetadata,
  ) => LogSpan
  setUser: (
    userId: string | null,
    userEmail?: string,
    userName?: string,
  ) => void
  addBreadcrumb: (message: string, category: string, data?: LogMetadata) => void
}

/**
 * Configuration for logger initialization
 */
export interface LoggerConfig {
  enableSampling: boolean
  samplingRate: number
  isDevelopment: boolean
  appVersion: string
  environment: string
  platform: string
}
