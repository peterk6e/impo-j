// src/lib/utils/logger.ts
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: keyof LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: LOG_LEVELS[level],
      message,
      ...(meta && { meta }),
    };

    if (this.isDevelopment) {
      console[level](JSON.stringify(logEntry, null, 2));
    } else {
      // In production, send to external service (Sentry, DataDog, etc.)
      console[level](JSON.stringify(logEntry));
    }
  }

  error(message: string, meta?: any) {
    this.log('ERROR', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('WARN', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('INFO', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('DEBUG', message, meta);
  }
}

export const logger = new Logger();
