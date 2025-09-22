import { NextResponse } from 'next/server';
import { trackError } from './logger';

// Base error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly context?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    context?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 400, 'VALIDATION_ERROR', true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: any) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR', true, context);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 409, 'CONFLICT_ERROR', true, context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', true, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 500, 'DATABASE_ERROR', true, context);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, context?: any) {
    super(`External service error (${service}): ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', true, context);
  }
}

export class MaintenanceError extends AppError {
  constructor(message: string = 'System is under maintenance', context?: any) {
    super(message, 503, 'MAINTENANCE_ERROR', true, context);
  }
}

// Error handler for API routes
export const handleApiError = (error: Error | AppError, request?: Request) => {
  // Track the error
  trackError(error, {
    url: request?.url,
    method: request?.method,
    userAgent: request?.headers.get('User-Agent'),
  });

  // Handle known errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack,
          message: error.message,
        }),
      },
    },
    { status: 500 }
  );
};

// Error handler for middleware
export const handleMiddlewareError = (error: Error | AppError, request: Request) => {
  trackError(error, {
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('User-Agent'),
    type: 'middleware',
  });

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: {
          code: error.code,
          message: error.message,
        },
      }),
      {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

// Error boundary for React components
export class ErrorBoundary extends Error {
  public readonly componentStack?: string;
  public readonly errorInfo?: any;

  constructor(message: string, componentStack?: string, errorInfo?: any) {
    super(message);
    this.name = 'ErrorBoundary';
    this.componentStack = componentStack;
    this.errorInfo = errorInfo;
  }
}

// Validation error handler
export const handleValidationError = (errors: any[]) => {
  const message = errors.map(error => error.message).join(', ');
  return new ValidationError(message, { errors });
};

// Database error handler
export const handleDatabaseError = (error: any) => {
  let message = 'Database operation failed';
  let code = 'DATABASE_ERROR';

  if (error.code === 'P2002') {
    message = 'Unique constraint violation';
    code = 'UNIQUE_CONSTRAINT_ERROR';
  } else if (error.code === 'P2025') {
    message = 'Record not found';
    code = 'RECORD_NOT_FOUND_ERROR';
  } else if (error.code === 'P2003') {
    message = 'Foreign key constraint violation';
    code = 'FOREIGN_KEY_ERROR';
  }

  return new DatabaseError(message, { originalError: error, code });
};

// External service error handler
export const handleExternalServiceError = (service: string, error: any) => {
  let message = 'External service unavailable';
  
  if (error.response) {
    message = `External service returned ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    message = 'External service request failed';
  } else {
    message = error.message || 'External service error';
  }

  return new ExternalServiceError(service, message, { originalError: error });
};

// Rate limiting error handler
export const handleRateLimitError = (limit: number, window: number) => {
  const message = `Rate limit exceeded. Maximum ${limit} requests per ${window / 1000} seconds.`;
  return new RateLimitError(message, { limit, window });
};

// Authentication error handler
export const handleAuthenticationError = (reason: string = 'Invalid credentials') => {
  return new AuthenticationError(reason);
};

// Authorization error handler
export const handleAuthorizationError = (resource: string, action: string) => {
  const message = `Insufficient permissions to ${action} ${resource}`;
  return new AuthorizationError(message, { resource, action });
};

// Not found error handler
export const handleNotFoundError = (resource: string, id?: string) => {
  const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
  return new NotFoundError(message, { resource, id });
};

// Conflict error handler
export const handleConflictError = (resource: string, conflict: string) => {
  const message = `${resource} conflict: ${conflict}`;
  return new ConflictError(message, { resource, conflict });
};

// Maintenance mode error handler
export const handleMaintenanceError = (message?: string) => {
  return new MaintenanceError(message);
};

// Error response formatter
export const formatErrorResponse = (error: AppError) => {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.context && { context: error.context }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  };
};

// Error codes enum
export const ErrorCodes = {
  // Authentication & Authorization
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNIQUE_CONSTRAINT_ERROR: 'UNIQUE_CONSTRAINT_ERROR',
  FOREIGN_KEY_ERROR: 'FOREIGN_KEY_ERROR',
  RECORD_NOT_FOUND_ERROR: 'RECORD_NOT_FOUND_ERROR',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',
  EMAIL_SERVICE_ERROR: 'EMAIL_SERVICE_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  MAINTENANCE_ERROR: 'MAINTENANCE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // File Operations
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  
  // Real-time
  WEBSOCKET_ERROR: 'WEBSOCKET_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Feature Flags
  FEATURE_DISABLED: 'FEATURE_DISABLED',
  
  // Analytics
  ANALYTICS_ERROR: 'ANALYTICS_ERROR',
  
  // Collaboration
  COLLABORATION_ERROR: 'COLLABORATION_ERROR',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Error categories
export const ErrorCategories = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  DATABASE: 'database',
  EXTERNAL_SERVICE: 'external_service',
  RATE_LIMITING: 'rate_limiting',
  FILE_OPERATION: 'file_operation',
  REAL_TIME: 'real_time',
  SYSTEM: 'system',
  USER_INPUT: 'user_input',
} as const;

// Error handler utility
export const createErrorHandler = (category: string) => {
  return (error: Error, context?: any) => {
    const appError = new AppError(
      error.message,
      500,
      'INTERNAL_ERROR',
      true,
      { category, ...context }
    );
    
    trackError(appError, { category, ...context });
    return appError;
  };
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error recovery strategies
export const ErrorRecoveryStrategies = {
  RETRY: 'retry',
  FALLBACK: 'fallback',
  CIRCUIT_BREAKER: 'circuit_breaker',
  GRACEFUL_DEGRADATION: 'graceful_degradation',
} as const;

// Error recovery handler
export const handleErrorRecovery = (
  error: AppError,
  strategy: string,
  context?: any
) => {
  switch (strategy) {
    case ErrorRecoveryStrategies.RETRY:
      // Implement retry logic
      break;
    case ErrorRecoveryStrategies.FALLBACK:
      // Implement fallback logic
      break;
    case ErrorRecoveryStrategies.CIRCUIT_BREAKER:
      // Implement circuit breaker logic
      break;
    case ErrorRecoveryStrategies.GRACEFUL_DEGRADATION:
      // Implement graceful degradation
      break;
    default:
      trackError(error, { strategy, ...context });
  }
};

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  MaintenanceError,
  handleApiError,
  handleMiddlewareError,
  handleValidationError,
  handleDatabaseError,
  handleExternalServiceError,
  handleRateLimitError,
  handleAuthenticationError,
  handleAuthorizationError,
  handleNotFoundError,
  handleConflictError,
  handleMaintenanceError,
  formatErrorResponse,
  ErrorCodes,
  ErrorSeverity,
  ErrorCategories,
  createErrorHandler,
  asyncHandler,
  ErrorRecoveryStrategies,
  handleErrorRecovery,
};
