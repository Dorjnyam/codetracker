import winston from 'winston';
import { config } from './config';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.format === 'json' ? config.env.logLevel : 'debug',
  format: logFormat,
  defaultMeta: {
    service: 'codetracker',
    environment: config.env.nodeEnv,
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: config.env.nodeEnv === 'development' ? consoleFormat : logFormat,
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: logFormat,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: logFormat,
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: logFormat,
    }),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: logFormat,
    }),
  ],
});

// Add request ID to logs
export const addRequestId = (req: any, res: any, next: any) => {
  req.requestId = Math.random().toString(36).substring(2, 15);
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

// Logging middleware for Express
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: any, res: any, next: any) => {
  const logData = {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    userId: req.user?.id,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  };
  
  logger.error('Unhandled Error', logData);
  next(error);
};

// Structured logging methods
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logError = (message: string, error?: Error | any, meta?: any) => {
  const logData = {
    ...meta,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };
  
  logger.error(message, logData);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Performance logging
export const logPerformance = (operation: string, duration: number, meta?: any) => {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    ...meta,
  });
};

// Database query logging
export const logDatabaseQuery = (query: string, duration: number, meta?: any) => {
  logger.debug('Database Query', {
    query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
    duration: `${duration}ms`,
    ...meta,
  });
};

// API call logging
export const logApiCall = (method: string, url: string, statusCode: number, duration: number, meta?: any) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger[level]('API Call', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    ...meta,
  });
};

// User action logging
export const logUserAction = (action: string, userId: string, meta?: any) => {
  logger.info('User Action', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

// Security event logging
export const logSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  logger[level]('Security Event', {
    event,
    severity,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

// System event logging
export const logSystemEvent = (event: string, meta?: any) => {
  logger.info('System Event', {
    event,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

// Feature usage logging
export const logFeatureUsage = (feature: string, userId: string, meta?: any) => {
  logger.info('Feature Usage', {
    feature,
    userId,
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

// Error tracking with context
export const trackError = (error: Error, context: any = {}) => {
  logError('Application Error', error, {
    ...context,
    timestamp: new Date().toISOString(),
    environment: config.env.nodeEnv,
  });
  
  // Send to external error tracking service if configured
  if (config.monitoring.sentry.dsn) {
    // Sentry integration would go here
    console.log('Sending error to Sentry:', error.message);
  }
};

// Performance tracking
export const trackPerformance = (operation: string, startTime: number, meta?: any) => {
  const duration = Date.now() - startTime;
  logPerformance(operation, duration, meta);
  
  // Alert if performance is poor
  if (duration > 5000) { // 5 seconds
    logWarn('Slow Operation', {
      operation,
      duration: `${duration}ms`,
      ...meta,
    });
  }
};

// Database performance tracking
export const trackDatabasePerformance = (query: string, startTime: number, meta?: any) => {
  const duration = Date.now() - startTime;
  logDatabaseQuery(query, duration, meta);
  
  // Alert if query is slow
  if (duration > 1000) { // 1 second
    logWarn('Slow Database Query', {
      query: query.substring(0, 200),
      duration: `${duration}ms`,
      ...meta,
    });
  }
};

// API performance tracking
export const trackApiPerformance = (method: string, url: string, startTime: number, meta?: any) => {
  const duration = Date.now() - startTime;
  logApiCall(method, url, 200, duration, meta);
  
  // Alert if API call is slow
  if (duration > 3000) { // 3 seconds
    logWarn('Slow API Call', {
      method,
      url,
      duration: `${duration}ms`,
      ...meta,
    });
  }
};

// User session tracking
export const trackUserSession = (action: 'login' | 'logout' | 'session_start' | 'session_end', userId: string, meta?: any) => {
  logUserAction(`Session ${action}`, userId, {
    ...meta,
    timestamp: new Date().toISOString(),
  });
};

// Feature flag tracking
export const trackFeatureFlag = (flag: string, enabled: boolean, userId?: string, meta?: any) => {
  logFeatureUsage(`Feature Flag: ${flag}`, userId || 'anonymous', {
    enabled,
    ...meta,
  });
};

// Rate limiting tracking
export const trackRateLimit = (ip: string, endpoint: string, limit: number, meta?: any) => {
  logSecurityEvent('Rate Limit Exceeded', 'medium', {
    ip,
    endpoint,
    limit,
    ...meta,
  });
};

// Authentication tracking
export const trackAuthentication = (action: 'login' | 'logout' | 'register' | 'password_reset', userId: string, success: boolean, meta?: any) => {
  const severity = success ? 'low' : 'medium';
  logSecurityEvent(`Authentication ${action}`, severity, {
    userId,
    success,
    ...meta,
  });
};

// Data access tracking
export const trackDataAccess = (resource: string, action: 'read' | 'write' | 'delete', userId: string, meta?: any) => {
  logUserAction(`Data Access: ${action} ${resource}`, userId, {
    resource,
    action,
    ...meta,
  });
};

// Export logger instance for direct use
export { logger };

// Default export
export default logger;
