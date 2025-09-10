// services/logging.service.ts
import { config } from '@/config'

// Service Error Class
export class LoggingServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'LoggingServiceError'
  }
}

// Log Data Type - more specific than 'any'
type LogData = Record<string, unknown> | Error | null | undefined

// Service Interface
interface LoggingService {
  log(message: string, data?: LogData): void
  info(message: string, data?: LogData): void
  warn(message: string, data?: LogData): void
  error(message: string, error?: Error, data?: LogData): void
  createLogger(tag: string): LoggingService
}

// Logging Service Implementation
class LoggingServiceImpl implements LoggingService {
  constructor(private tag?: string) {}

  private formatMessage(level: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString()
    const env = config.app.env
    const appName = config.app.name
    
    let logMessage = `[${timestamp}] [${appName} - ${env}] [${level.toUpperCase()}]`
    
    if (this.tag) {
      logMessage += ` [${this.tag}]`
    }
    
    logMessage += ` ${message}`
    
    if (data) {
      if (data instanceof Error) {
        logMessage += ` | Error: ${data.name} - ${data.message}`
        if (config.app.env === 'development') {
          logMessage += ` | Stack: ${data.stack}`
        }
      } else if (data !== null && data !== undefined) {
        logMessage += ` | Data: ${JSON.stringify(data)}`
      }
    }
    
    return logMessage
  }

  private logMessage(level: 'log' | 'info' | 'warn' | 'error', message: string, data?: LogData): void {
    try {
      const formattedMessage = this.formatMessage(level, message, data)
      
      switch (level) {
        case 'log':
        case 'info':
          console.log(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage)
          break
        case 'error':
          console.error(formattedMessage)
          break
        default:
          console.log(formattedMessage)
      }
    } catch (error) {
      console.error(`[LOGGING_ERROR] Failed to log message: ${error}`)
      console.log(`[${level.toUpperCase()}] ${message}`, data)
    }
  }

  log(message: string, data?: LogData): void {
    this.logMessage('log', message, data)
  }

  info(message: string, data?: LogData): void {
    this.logMessage('info', message, data)
  }

  warn(message: string, data?: LogData): void {
    this.logMessage('warn', message, data)
  }

  error(message: string, error?: Error, data?: LogData): void {
    try {
      const errorData = error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(data as Record<string, unknown> || {})
      } : data
      
      this.logMessage('error', message, errorData)
    } catch (logError) {
      console.error(`[LOGGING_ERROR] Failed to log message: ${logError}`)
      console.error(`[ERROR] ${message}`, error, data)
    }
  }

  // const taggedLogger = loggingService.createLogger('TAG')
  // taggedLogger.log('message', { data })
  createLogger(tag: string): LoggingService {
    return new LoggingServiceImpl(tag)
  }
}

// Export Singleton
export const loggingService = new LoggingServiceImpl()
