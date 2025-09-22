import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // OAuth Providers
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  
  // Email
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().transform(Number).optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Security
  ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  
  // Feature Flags
  ENABLE_GAMIFICATION: z.string().transform(val => val === 'true').default('true'),
  ENABLE_COLLABORATION: z.string().transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_GITHUB_INTEGRATION: z.string().transform(val => val === 'true').default('true'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z.string().transform(val => val === 'true').default('false'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Database Pool
  DB_POOL_MIN: z.string().transform(Number).default('2'),
  DB_POOL_MAX: z.string().transform(Number).default('10'),
  
  // Session
  SESSION_MAX_AGE: z.string().transform(Number).default('2592000'),
  SESSION_UPDATE_AGE: z.string().transform(Number).default('86400'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // File Upload
  UPLOAD_MAX_SIZE: z.string().transform(Number).default('10485760'),
  UPLOAD_ALLOWED_TYPES: z.string().default('image/jpeg,image/png,image/gif,text/plain,application/pdf'),
  
  // Storage
  STORAGE_PROVIDER: z.enum(['local', 'aws-s3', 'cloudinary']).default('local'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Real-time
  SOCKET_IO_CORS_ORIGIN: z.string().default('http://localhost:3000'),
  WEBSOCKET_ENABLED: z.string().transform(val => val === 'true').default('true'),
  WEBSOCKET_PORT: z.string().transform(Number).default('3001'),
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: z.string().transform(val => val === 'true').default('true'),
  PERFORMANCE_SAMPLE_RATE: z.string().transform(Number).default('0.1'),
  
  // Cache
  CACHE_TTL: z.string().transform(Number).default('3600'),
  CACHE_MAX_SIZE: z.string().transform(Number).default('100'),
  
  // Logging
  LOG_FORMAT: z.enum(['json', 'text']).default('json'),
  LOG_FILE: z.string().default('logs/app.log'),
  LOG_MAX_SIZE: z.string().default('10m'),
  LOG_MAX_FILES: z.string().transform(Number).default('5'),
  
  // Health Check
  HEALTH_CHECK_INTERVAL: z.string().transform(Number).default('30000'),
  HEALTH_CHECK_TIMEOUT: z.string().transform(Number).default('5000'),
  
  // Maintenance
  MAINTENANCE_MODE: z.string().transform(val => val === 'true').default('false'),
  MAINTENANCE_MESSAGE: z.string().default('System is under maintenance. Please try again later.'),
  
  // Security Headers
  SECURITY_HEADERS_ENABLED: z.string().transform(val => val === 'true').default('true'),
  CSP_REPORT_URI: z.string().url().optional(),
  
  // Database Migration
  AUTO_MIGRATE: z.string().transform(val => val === 'true').default('false'),
  MIGRATION_TIMEOUT: z.string().transform(Number).default('300000'),
  
  // Error Reporting
  ERROR_REPORTING_ENABLED: z.string().transform(val => val === 'true').default('true'),
  ERROR_REPORTING_LEVEL: z.enum(['error', 'warn', 'info']).default('error'),
  
  // Analytics
  ANALYTICS_ENABLED: z.string().transform(val => val === 'true').default('true'),
  ANALYTICS_PRIVACY_MODE: z.string().transform(val => val === 'true').default('true'),
  
  // Content Moderation
  CONTENT_MODERATION_ENABLED: z.string().transform(val => val === 'true').default('false'),
  MODERATION_API_KEY: z.string().optional(),
  
  // Search
  SEARCH_PROVIDER: z.enum(['database', 'elasticsearch', 'algolia']).default('database'),
  ELASTICSEARCH_URL: z.string().url().optional(),
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
  
  // Queue
  QUEUE_PROVIDER: z.enum(['bull', 'agenda']).default('bull'),
  REDIS_QUEUE_URL: z.string().url().optional(),
  
  // SSL
  SSL_ENABLED: z.string().transform(val => val === 'true').default('true'),
  SSL_CERT_PATH: z.string().optional(),
  SSL_KEY_PATH: z.string().optional(),
  
  // Load Balancing
  LOAD_BALANCER_ENABLED: z.string().transform(val => val === 'true').default('false'),
  LOAD_BALANCER_ALGORITHM: z.enum(['round-robin', 'least-connections', 'ip-hash']).default('round-robin'),
  
  // Auto-scaling
  AUTO_SCALE_ENABLED: z.string().transform(val => val === 'true').default('false'),
  MIN_INSTANCES: z.string().transform(Number).default('1'),
  MAX_INSTANCES: z.string().transform(Number).default('10'),
  
  // Resource Limits
  MEMORY_LIMIT: z.string().default('512m'),
  CPU_LIMIT: z.string().default('1000m'),
  
  // Monitoring Endpoints
  METRICS_ENDPOINT: z.string().default('/metrics'),
  HEALTH_ENDPOINT: z.string().default('/health'),
  READINESS_ENDPOINT: z.string().default('/ready'),
  
  // Development Tools
  ENABLE_DEV_TOOLS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_PROFILING: z.string().transform(val => val === 'true').default('false'),
  ENABLE_DEBUG_MODE: z.string().transform(val => val === 'true').default('false'),
});

// Validate environment variables
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables:', error);
  process.exit(1);
}

// Configuration object
export const config = {
  // Database
  database: {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
    pool: {
      min: env.DB_POOL_MIN,
      max: env.DB_POOL_MAX,
    },
    migration: {
      autoMigrate: env.AUTO_MIGRATE,
      timeout: env.MIGRATION_TIMEOUT,
    },
  },
  
  // Authentication
  auth: {
    url: env.NEXTAUTH_URL,
    secret: env.NEXTAUTH_SECRET,
    session: {
      maxAge: env.SESSION_MAX_AGE,
      updateAge: env.SESSION_UPDATE_AGE,
    },
    providers: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      discord: {
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      },
    },
  },
  
  // Email
  email: {
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    user: env.EMAIL_SERVER_USER,
    password: env.EMAIL_SERVER_PASSWORD,
    from: env.EMAIL_FROM,
  },
  
  // Redis
  redis: {
    url: env.REDIS_URL,
    queue: {
      url: env.REDIS_QUEUE_URL || env.REDIS_URL,
      provider: env.QUEUE_PROVIDER,
    },
  },
  
  // Security
  security: {
    encryptionKey: env.ENCRYPTION_KEY,
    jwtSecret: env.JWT_SECRET,
    headers: {
      enabled: env.SECURITY_HEADERS_ENABLED,
      cspReportUri: env.CSP_REPORT_URI,
    },
    ssl: {
      enabled: env.SSL_ENABLED,
      certPath: env.SSL_CERT_PATH,
      keyPath: env.SSL_KEY_PATH,
    },
  },
  
  // Monitoring
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN,
    },
    analytics: {
      googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
      enabled: env.ANALYTICS_ENABLED,
      privacyMode: env.ANALYTICS_PRIVACY_MODE,
    },
    performance: {
      enabled: env.ENABLE_PERFORMANCE_MONITORING,
      sampleRate: env.PERFORMANCE_SAMPLE_RATE,
    },
    errorReporting: {
      enabled: env.ERROR_REPORTING_ENABLED,
      level: env.ERROR_REPORTING_LEVEL,
    },
  },
  
  // Feature Flags
  features: {
    gamification: env.ENABLE_GAMIFICATION,
    collaboration: env.ENABLE_COLLABORATION,
    analytics: env.ENABLE_ANALYTICS,
    githubIntegration: env.ENABLE_GITHUB_INTEGRATION,
  },
  
  // Rate Limiting
  rateLimit: {
    window: env.RATE_LIMIT_WINDOW,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // Environment
  env: {
    nodeEnv: env.NODE_ENV,
    debug: env.DEBUG,
    logLevel: env.LOG_LEVEL,
  },
  
  // CORS
  cors: {
    origin: env.CORS_ORIGIN,
    socketIoOrigin: env.SOCKET_IO_CORS_ORIGIN,
  },
  
  // File Upload
  upload: {
    maxSize: env.UPLOAD_MAX_SIZE,
    allowedTypes: env.UPLOAD_ALLOWED_TYPES.split(','),
  },
  
  // Storage
  storage: {
    provider: env.STORAGE_PROVIDER,
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.AWS_S3_BUCKET,
    },
  },
  
  // Real-time
  realtime: {
    websocket: {
      enabled: env.WEBSOCKET_ENABLED,
      port: env.WEBSOCKET_PORT,
    },
  },
  
  // Cache
  cache: {
    ttl: env.CACHE_TTL,
    maxSize: env.CACHE_MAX_SIZE,
  },
  
  // Logging
  logging: {
    format: env.LOG_FORMAT,
    file: env.LOG_FILE,
    maxSize: env.LOG_MAX_SIZE,
    maxFiles: env.LOG_MAX_FILES,
  },
  
  // Health Check
  healthCheck: {
    interval: env.HEALTH_CHECK_INTERVAL,
    timeout: env.HEALTH_CHECK_TIMEOUT,
    endpoints: {
      metrics: env.METRICS_ENDPOINT,
      health: env.HEALTH_ENDPOINT,
      readiness: env.READINESS_ENDPOINT,
    },
  },
  
  // Maintenance
  maintenance: {
    mode: env.MAINTENANCE_MODE,
    message: env.MAINTENANCE_MESSAGE,
  },
  
  // Content Moderation
  moderation: {
    enabled: env.CONTENT_MODERATION_ENABLED,
    apiKey: env.MODERATION_API_KEY,
  },
  
  // Search
  search: {
    provider: env.SEARCH_PROVIDER,
    elasticsearch: {
      url: env.ELASTICSEARCH_URL,
    },
    algolia: {
      appId: env.ALGOLIA_APP_ID,
      apiKey: env.ALGOLIA_API_KEY,
    },
  },
  
  // Load Balancing
  loadBalancer: {
    enabled: env.LOAD_BALANCER_ENABLED,
    algorithm: env.LOAD_BALANCER_ALGORITHM,
  },
  
  // Auto-scaling
  autoScale: {
    enabled: env.AUTO_SCALE_ENABLED,
    minInstances: env.MIN_INSTANCES,
    maxInstances: env.MAX_INSTANCES,
  },
  
  // Resource Limits
  resources: {
    memoryLimit: env.MEMORY_LIMIT,
    cpuLimit: env.CPU_LIMIT,
  },
  
  // Development Tools
  devTools: {
    enabled: env.ENABLE_DEV_TOOLS,
    profiling: env.ENABLE_PROFILING,
    debugMode: env.ENABLE_DEBUG_MODE,
  },
} as const;

// Type-safe environment access
export type Config = typeof config;

// Helper functions
export const isDevelopment = () => config.env.nodeEnv === 'development';
export const isProduction = () => config.env.nodeEnv === 'production';
export const isTest = () => config.env.nodeEnv === 'test';

export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};

export const getDatabaseUrl = () => config.database.url;
export const getRedisUrl = () => config.redis.url;

export const getAuthProviders = () => {
  const providers = [];
  
  if (config.auth.providers.github.clientId) {
    providers.push('github');
  }
  if (config.auth.providers.google.clientId) {
    providers.push('google');
  }
  if (config.auth.providers.discord.clientId) {
    providers.push('discord');
  }
  
  return providers;
};

export const getStorageConfig = () => {
  switch (config.storage.provider) {
    case 'aws-s3':
      return {
        provider: 'aws-s3',
        config: config.storage.aws,
      };
    case 'cloudinary':
      return {
        provider: 'cloudinary',
        config: {},
      };
    default:
      return {
        provider: 'local',
        config: {},
      };
  }
};

export const getSearchConfig = () => {
  switch (config.search.provider) {
    case 'elasticsearch':
      return {
        provider: 'elasticsearch',
        config: config.search.elasticsearch,
      };
    case 'algolia':
      return {
        provider: 'algolia',
        config: config.search.algolia,
      };
    default:
      return {
        provider: 'database',
        config: {},
      };
  }
};

// Validation helpers
export const validateConfig = () => {
  const errors: string[] = [];
  
  // Required for production
  if (isProduction()) {
    if (!config.auth.secret) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }
    if (!config.database.url) {
      errors.push('DATABASE_URL is required in production');
    }
    if (!config.auth.url) {
      errors.push('NEXTAUTH_URL is required in production');
    }
  }
  
  // Feature-specific validations
  if (isFeatureEnabled('githubIntegration')) {
    if (!config.auth.providers.github.clientId) {
      errors.push('GitHub integration enabled but GITHUB_CLIENT_ID not provided');
    }
  }
  
  if (config.storage.provider === 'aws-s3') {
    if (!config.storage.aws.accessKeyId || !config.storage.aws.secretAccessKey) {
      errors.push('AWS S3 storage enabled but credentials not provided');
    }
  }
  
  if (config.search.provider === 'elasticsearch' && !config.search.elasticsearch.url) {
    errors.push('Elasticsearch search enabled but ELASTICSEARCH_URL not provided');
  }
  
  if (config.search.provider === 'algolia') {
    if (!config.search.algolia.appId || !config.search.algolia.apiKey) {
      errors.push('Algolia search enabled but credentials not provided');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
  
  return true;
};

// Initialize configuration
export const initializeConfig = () => {
  try {
    validateConfig();
    console.log('✅ Configuration validated successfully');
    return config;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
};

export default config;
