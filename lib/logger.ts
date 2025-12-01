/**
 * Structured logging utility
 * Provides consistent logging across the application
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private minLevel: LogLevel = process.env.LOG_LEVEL as LogLevel || 'info'

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel]
  }

  private formatLog(entry: LogEntry): string {
    const emoji = {
      debug: '🔍',
      info: '📘',
      warn: '⚠️',
      error: '❌',
    }

    if (this.isDevelopment) {
      return `${emoji[entry.level]} [${entry.level.toUpperCase()}] ${entry.message} ${
        entry.context ? JSON.stringify(entry.context, null, 2) : ''
      }`
    }

    return JSON.stringify(entry)
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    const formatted = this.formatLog(entry)

    switch (level) {
      case 'debug':
      case 'info':
        if (this.isDevelopment) {
          // eslint-disable-next-line no-console
          console.log(formatted)
        }
        break
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(formatted)
        break
      case 'error':
        // eslint-disable-next-line no-console
        console.error(formatted)
        break
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, context, error)
  }

  // Specific loggers for different contexts
  api(method: string, path: string, status: number, duration?: number) {
    this.info('API Request', {
      method,
      path,
      status,
      duration: duration ? `${duration}ms` : undefined,
    })
  }

  auth(action: string, userId?: string, success: boolean = true) {
    this.info('Authentication Event', {
      action,
      userId,
      success,
    })
  }

  database(operation: string, table: string, duration?: number) {
    this.debug('Database Operation', {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
    })
  }

  payment(action: string, playerId: string, amount?: number, currency?: string) {
    this.info('Payment Event', {
      action,
      playerId,
      amount,
      currency,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Error handler wrapper
export function withErrorHandling<T>(
  fn: () => T | Promise<T>,
  context: string
): Promise<T> {
  return Promise.resolve(fn()).catch((error) => {
    logger.error(`Error in ${context}`, error, {
      stack: error.stack,
    })
    throw error
  })
}
