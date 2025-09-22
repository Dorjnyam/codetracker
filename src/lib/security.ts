import { NextRequest, NextResponse } from 'next/server';
import { config } from './config';
import { logSecurityEvent } from './logger';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};

// Rate limiting middleware
export const rateLimitMiddleware = (maxRequests: number = 100, windowMs: number = 900000) => {
  return (request: NextRequest) => {
    const ip = getClientIP(request);
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null;
    }
    
    if (current.count >= maxRequests) {
      logSecurityEvent('Rate Limit Exceeded', 'medium', {
        ip,
        endpoint: request.nextUrl.pathname,
        limit: maxRequests,
        window: windowMs,
      });
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        { status: 429 }
      );
    }
    
    current.count++;
    return null;
  };
};

// Get client IP address
export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// SQL injection prevention
export const sanitizeSQL = (input: string): string => {
  return input
    .replace(/['"]/g, '') // Remove quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '') // Remove block comments
    .replace(/union/gi, '') // Remove UNION
    .replace(/select/gi, '') // Remove SELECT
    .replace(/insert/gi, '') // Remove INSERT
    .replace(/update/gi, '') // Remove UPDATE
    .replace(/delete/gi, '') // Remove DELETE
    .replace(/drop/gi, '') // Remove DROP
    .replace(/create/gi, '') // Remove CREATE
    .replace(/alter/gi, '') // Remove ALTER
    .replace(/exec/gi, '') // Remove EXEC
    .replace(/execute/gi, ''); // Remove EXECUTE
};

// XSS prevention
export const preventXSS = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// CSRF token validation
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length === 64;
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }
  
  // Common password check
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('Password is too common');
    score = Math.max(0, score - 2);
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

// File upload security
export const validateFileUpload = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  // Check file size
  const maxSize = config.upload.maxSize;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }
  
  // Check file type
  const allowedTypes = config.upload.allowedTypes;
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }
  
  // Check file name for malicious patterns
  const maliciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.pif$/i,
    /\.com$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        isValid: false,
        error: 'File type is not allowed for security reasons',
      };
    }
  }
  
  return { isValid: true };
};

// Content Security Policy
export const getCSPHeader = (): string => {
  const baseCSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  
  if (config.security.headers.cspReportUri) {
    baseCSP.push(`report-uri ${config.security.headers.cspReportUri}`);
  }
  
  return baseCSP.join('; ');
};

// Security headers middleware
export const securityHeadersMiddleware = (request: NextRequest) => {
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP header
  response.headers.set('Content-Security-Policy', getCSPHeader());
  
  return response;
};

// Request validation middleware
export const validateRequest = (request: NextRequest) => {
  const url = request.nextUrl;
  
  // Check for suspicious patterns in URL
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript protocol
    /union.*select/i, // SQL injection
    /exec.*\(/i, // Command injection
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url.pathname + url.search)) {
      logSecurityEvent('Suspicious Request Pattern', 'medium', {
        ip: getClientIP(request),
        url: url.href,
        pattern: pattern.toString(),
        userAgent: request.headers.get('User-Agent'),
      });
      
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }
  }
  
  return null;
};

// Authentication security
export const validateAuthRequest = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header required' },
      { status: 401 }
    );
  }
  
  // Check for valid Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    logSecurityEvent('Invalid Auth Header Format', 'low', {
      ip: getClientIP(request),
      header: authHeader.substring(0, 20) + '...',
    });
    
    return NextResponse.json(
      { error: 'Invalid authorization header format' },
      { status: 401 }
    );
  }
  
  return null;
};

// Session security
export const validateSession = (session: any) => {
  if (!session) {
    return { isValid: false, error: 'No session found' };
  }
  
  if (!session.user) {
    return { isValid: false, error: 'Invalid session' };
  }
  
  if (!session.user.id) {
    return { isValid: false, error: 'Session missing user ID' };
  }
  
  // Check session expiration
  const sessionAge = Date.now() - new Date(session.createdAt || 0).getTime();
  const maxAge = config.auth.session.maxAge;
  
  if (sessionAge > maxAge) {
    return { isValid: false, error: 'Session expired' };
  }
  
  return { isValid: true };
};

// IP whitelist/blacklist
export const validateIP = (ip: string): { allowed: boolean; reason?: string } => {
  // In a real implementation, you would check against IP whitelist/blacklist
  // For now, we'll implement basic checks
  
  // Check for private IPs (if needed)
  const privateIPs = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
  ];
  
  if (privateIPs.some(pattern => pattern.test(ip))) {
    return { allowed: true }; // Allow private IPs
  }
  
  // Check for localhost
  if (ip === '127.0.0.1' || ip === '::1') {
    return { allowed: true };
  }
  
  // In production, you might want to implement more sophisticated IP filtering
  return { allowed: true };
};

// Security event logging
export const logSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any) => {
  logSecurityEvent(event, severity, {
    ...details,
    timestamp: new Date().toISOString(),
    environment: config.env.nodeEnv,
  });
};

// Encryption utilities
export const encrypt = async (text: string): Promise<string> => {
  if (!config.security.encryptionKey) {
    throw new Error('Encryption key not configured');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(config.security.encryptionKey),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
};

export const decrypt = async (encryptedText: string): Promise<string> => {
  if (!config.security.encryptionKey) {
    throw new Error('Encryption key not configured');
  }
  
  const decoder = new TextDecoder();
  const data = new Uint8Array(atob(encryptedText).split('').map(c => c.charCodeAt(0)));
  
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);
  
  const key = await crypto.subtle.importKey(
    'raw',
    decoder.decode(config.security.encryptionKey),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  return decoder.decode(decrypted);
};

// Hash utilities
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Security middleware chain
export const securityMiddleware = (request: NextRequest) => {
  // Apply security headers
  const response = securityHeadersMiddleware(request);
  
  // Validate request
  const validationError = validateRequest(request);
  if (validationError) {
    return validationError;
  }
  
  // Validate IP
  const ip = getClientIP(request);
  const ipValidation = validateIP(ip);
  if (!ipValidation.allowed) {
    logSecurityEvent('IP Blocked', 'high', {
      ip,
      reason: ipValidation.reason,
    });
    
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }
  
  return response;
};

export default {
  rateLimitMiddleware,
  getClientIP,
  sanitizeInput,
  sanitizeSQL,
  preventXSS,
  generateCSRFToken,
  validateCSRFToken,
  validatePasswordStrength,
  validateFileUpload,
  getCSPHeader,
  securityHeadersMiddleware,
  validateRequest,
  validateAuthRequest,
  validateSession,
  validateIP,
  logSecurityEvent,
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  securityMiddleware,
};
