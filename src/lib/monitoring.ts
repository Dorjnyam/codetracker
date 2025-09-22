import { config } from './config';
import { logPerformance, logSystemEvent, trackPerformance } from './logger';

// Performance metrics interface
interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: any;
}

// System health interface
interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  services: {
    database: 'up' | 'down' | 'degraded';
    redis: 'up' | 'down' | 'degraded';
    external: 'up' | 'down' | 'degraded';
  };
}

// Performance monitoring class
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000;
  private alertThresholds = {
    slowOperation: 5000, // 5 seconds
    verySlowOperation: 10000, // 10 seconds
    memoryUsage: 80, // 80%
    cpuUsage: 80, // 80%
  };

  // Track operation performance
  trackOperation(operation: string, startTime: number, metadata?: any): number {
    const duration = Date.now() - startTime;
    
    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: new Date(),
      metadata,
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log performance
    logPerformance(operation, duration, metadata);

    // Check for slow operations
    if (duration > this.alertThresholds.slowOperation) {
      this.alertSlowOperation(operation, duration, metadata);
    }

    return duration;
  }

  // Get performance statistics
  getStats(operation?: string): any {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return null;
    }

    const durations = filteredMetrics.map(m => m.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const p95Duration = this.percentile(durations, 95);
    const p99Duration = this.percentile(durations, 99);

    return {
      operation: operation || 'all',
      count: filteredMetrics.length,
      avgDuration: Math.round(avgDuration),
      minDuration,
      maxDuration,
      p95Duration: Math.round(p95Duration),
      p99Duration: Math.round(p99Duration),
      slowOperations: durations.filter(d => d > this.alertThresholds.slowOperation).length,
    };
  }

  // Calculate percentile
  private percentile(arr: number[], p: number): number {
    const sorted = arr.sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Alert for slow operations
  private alertSlowOperation(operation: string, duration: number, metadata?: any) {
    const severity = duration > this.alertThresholds.verySlowOperation ? 'high' : 'medium';
    
    logSystemEvent('Slow Operation Alert', {
      operation,
      duration,
      severity,
      threshold: this.alertThresholds.slowOperation,
      metadata,
    });
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }
}

// System health monitor
class SystemHealthMonitor {
  private health: SystemHealth = {
    status: 'healthy',
    timestamp: new Date(),
    metrics: {
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
    },
    services: {
      database: 'up',
      redis: 'up',
      external: 'up',
    },
  };

  // Check system health
  async checkHealth(): Promise<SystemHealth> {
    try {
      // Check system metrics
      const metrics = await this.getSystemMetrics();
      
      // Check services
      const services = await this.checkServices();
      
      // Determine overall status
      const status = this.determineStatus(metrics, services);
      
      this.health = {
        status,
        timestamp: new Date(),
        metrics,
        services,
      };

      logSystemEvent('Health Check', {
        status,
        metrics,
        services,
      });

      return this.health;
    } catch (error) {
      logSystemEvent('Health Check Failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      this.health.status = 'unhealthy';
      return this.health;
    }
  }

  // Get system metrics
  private async getSystemMetrics(): Promise<SystemHealth['metrics']> {
    // In a real implementation, you would use system APIs
    // For now, we'll return mock data
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
    };
  }

  // Check service status
  private async checkServices(): Promise<SystemHealth['services']> {
    const services = {
      database: 'up' as const,
      redis: 'up' as const,
      external: 'up' as const,
    };

    // Check database
    try {
      // Add actual database health check here
      services.database = 'up';
    } catch (error) {
      services.database = 'down';
    }

    // Check Redis
    try {
      // Add actual Redis health check here
      services.redis = 'up';
    } catch (error) {
      services.redis = 'down';
    }

    // Check external services
    try {
      // Add actual external service health check here
      services.external = 'up';
    } catch (error) {
      services.external = 'down';
    }

    return services;
  }

  // Determine overall status
  private determineStatus(metrics: SystemHealth['metrics'], services: SystemHealth['services']): SystemHealth['status'] {
    // Check if any service is down
    if (Object.values(services).includes('down')) {
      return 'unhealthy';
    }

    // Check if any service is degraded
    if (Object.values(services).includes('degraded')) {
      return 'degraded';
    }

    // Check system metrics
    if (metrics.memory > 90 || metrics.cpu > 90 || metrics.disk > 90) {
      return 'unhealthy';
    }

    if (metrics.memory > 80 || metrics.cpu > 80 || metrics.disk > 80) {
      return 'degraded';
    }

    return 'healthy';
  }

  // Get current health
  getCurrentHealth(): SystemHealth {
    return this.health;
  }
}

// Resource usage monitor
class ResourceMonitor {
  private startTime = Date.now();
  private initialMemory = process.memoryUsage();

  // Get memory usage
  getMemoryUsage(): any {
    const currentMemory = process.memoryUsage();
    const uptime = Date.now() - this.startTime;

    return {
      rss: currentMemory.rss,
      heapTotal: currentMemory.heapTotal,
      heapUsed: currentMemory.heapUsed,
      external: currentMemory.external,
      arrayBuffers: currentMemory.arrayBuffers,
      uptime: uptime,
      memoryGrowth: {
        rss: currentMemory.rss - this.initialMemory.rss,
        heapUsed: currentMemory.heapUsed - this.initialMemory.heapUsed,
      },
    };
  }

  // Get CPU usage (simplified)
  getCpuUsage(): number {
    // In a real implementation, you would use more sophisticated CPU monitoring
    return Math.random() * 100;
  }

  // Get uptime
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  // Check for memory leaks
  checkMemoryLeak(): boolean {
    const memory = this.getMemoryUsage();
    const memoryGrowthRate = memory.memoryGrowth.heapUsed / memory.uptime;
    
    // Alert if memory growth rate is too high
    return memoryGrowthRate > 1024 * 1024; // 1MB per second
  }
}

// Database performance monitor
class DatabaseMonitor {
  private queryMetrics: Array<{
    query: string;
    duration: number;
    timestamp: Date;
    success: boolean;
  }> = [];

  // Track database query
  trackQuery(query: string, duration: number, success: boolean = true): void {
    this.queryMetrics.push({
      query: query.substring(0, 200), // Truncate long queries
      duration,
      timestamp: new Date(),
      success,
    });

    // Keep only recent metrics
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000);
    }

    // Log slow queries
    if (duration > 1000) { // 1 second
      logSystemEvent('Slow Database Query', {
        query: query.substring(0, 100),
        duration,
        success,
      });
    }
  }

  // Get query statistics
  getQueryStats(): any {
    if (this.queryMetrics.length === 0) {
      return null;
    }

    const durations = this.queryMetrics.map(m => m.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowQueries = this.queryMetrics.filter(m => m.duration > 1000).length;
    const failedQueries = this.queryMetrics.filter(m => !m.success).length;

    return {
      totalQueries: this.queryMetrics.length,
      avgDuration: Math.round(avgDuration),
      slowQueries,
      failedQueries,
      successRate: ((this.queryMetrics.length - failedQueries) / this.queryMetrics.length) * 100,
    };
  }
}

// API performance monitor
class ApiMonitor {
  private requestMetrics: Array<{
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    timestamp: Date;
  }> = [];

  // Track API request
  trackRequest(method: string, url: string, statusCode: number, duration: number): void {
    this.requestMetrics.push({
      method,
      url,
      statusCode,
      duration,
      timestamp: new Date(),
    });

    // Keep only recent metrics
    if (this.requestMetrics.length > 1000) {
      this.requestMetrics = this.requestMetrics.slice(-1000);
    }

    // Log slow requests
    if (duration > 3000) { // 3 seconds
      logSystemEvent('Slow API Request', {
        method,
        url,
        statusCode,
        duration,
      });
    }
  }

  // Get API statistics
  getApiStats(): any {
    if (this.requestMetrics.length === 0) {
      return null;
    }

    const durations = this.requestMetrics.map(m => m.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowRequests = this.requestMetrics.filter(m => m.duration > 3000).length;
    const errorRequests = this.requestMetrics.filter(m => m.statusCode >= 400).length;

    return {
      totalRequests: this.requestMetrics.length,
      avgDuration: Math.round(avgDuration),
      slowRequests,
      errorRequests,
      successRate: ((this.requestMetrics.length - errorRequests) / this.requestMetrics.length) * 100,
    };
  }
}

// Create singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const systemHealthMonitor = new SystemHealthMonitor();
export const resourceMonitor = new ResourceMonitor();
export const databaseMonitor = new DatabaseMonitor();
export const apiMonitor = new ApiMonitor();

// Performance decorator
export function trackPerformance(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      try {
        const result = await method.apply(this, args);
        performanceMonitor.trackOperation(operation, startTime, { success: true });
        return result;
      } catch (error) {
        performanceMonitor.trackOperation(operation, startTime, { success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        throw error;
      }
    };

    return descriptor;
  };
}

// Database query tracking decorator
export function trackDatabaseQuery(queryName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      try {
        const result = await method.apply(this, args);
        databaseMonitor.trackQuery(queryName, Date.now() - startTime, true);
        return result;
      } catch (error) {
        databaseMonitor.trackQuery(queryName, Date.now() - startTime, false);
        throw error;
      }
    };

    return descriptor;
  };
}

// API request tracking decorator
export function trackApiRequest(endpoint: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      try {
        const result = await method.apply(this, args);
        apiMonitor.trackRequest('GET', endpoint, 200, Date.now() - startTime);
        return result;
      } catch (error) {
        apiMonitor.trackRequest('GET', endpoint, 500, Date.now() - startTime);
        throw error;
      }
    };

    return descriptor;
  };
}

// Health check endpoint data
export const getHealthCheckData = async () => {
  const health = await systemHealthMonitor.checkHealth();
  const memory = resourceMonitor.getMemoryUsage();
  const performance = performanceMonitor.getStats();
  const database = databaseMonitor.getQueryStats();
  const api = apiMonitor.getApiStats();

  return {
    status: health.status,
    timestamp: health.timestamp,
    uptime: resourceMonitor.getUptime(),
    memory,
    performance,
    database,
    api,
    services: health.services,
  };
};

// Performance metrics endpoint data
export const getPerformanceMetrics = () => {
  return {
    operations: performanceMonitor.getAllMetrics(),
    stats: performanceMonitor.getStats(),
    memory: resourceMonitor.getMemoryUsage(),
    database: databaseMonitor.getQueryStats(),
    api: apiMonitor.getApiStats(),
  };
};

// System metrics endpoint data
export const getSystemMetrics = () => {
  return {
    health: systemHealthMonitor.getCurrentHealth(),
    memory: resourceMonitor.getMemoryUsage(),
    cpu: resourceMonitor.getCpuUsage(),
    uptime: resourceMonitor.getUptime(),
    memoryLeak: resourceMonitor.checkMemoryLeak(),
  };
};

export default {
  performanceMonitor,
  systemHealthMonitor,
  resourceMonitor,
  databaseMonitor,
  apiMonitor,
  trackPerformance,
  trackDatabaseQuery,
  trackApiRequest,
  getHealthCheckData,
  getPerformanceMetrics,
  getSystemMetrics,
};
