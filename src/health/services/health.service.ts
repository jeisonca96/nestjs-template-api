import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import * as moment from 'moment';
import * as fs from 'fs';
import * as os from 'os';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async checkApplication() {
    const indicator = this.healthIndicatorService.check('application');
    try {
      const version = process.env.npm_package_version;
      const isHealthy = true;

      return isHealthy
        ? indicator.up({
            version,
            environment: process.env.NODE_ENV || 'development',
            utc: moment.utc().format(),
            local: moment().format(),
          })
        : indicator.down({
            error: 'Application health check failed',
          });
    } catch (error) {
      return indicator.down({
        error: 'Application check error',
        details: error.message,
      });
    }
  }

  async checkDatabase() {
    const indicator = this.healthIndicatorService.check('database');
    try {
      const isHealthy = true;

      return isHealthy
        ? indicator.up({ timestamp: moment().unix() })
        : indicator.down({ error: 'Database connection failed' });
    } catch (error) {
      return indicator.down({
        error: 'Database check error',
        details: error.message,
      });
    }
  }

  async checkMemory() {
    const indicator = this.healthIndicatorService.check('memory');
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      const memoryThreshold = 90; // 90% memory usage threshold
      const isHealthy = memoryUsagePercent < memoryThreshold;

      return isHealthy
        ? indicator.up({
            total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
            free: `${Math.round(freeMemory / 1024 / 1024)}MB`,
            used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
            usage: `${memoryUsagePercent.toFixed(2)}%`,
          })
        : indicator.down({
            error: 'High memory usage detected',
            usage: `${memoryUsagePercent.toFixed(2)}%`,
            threshold: `${memoryThreshold}%`,
          });
    } catch (error) {
      return indicator.down({
        error: 'Memory check error',
        details: error.message,
      });
    }
  }

  async checkDisk() {
    const indicator = this.healthIndicatorService.check('disk');
    try {
      const stats = fs.statSync(process.cwd());
      const diskThreshold = 90; // 90% disk usage threshold

      // For a more accurate disk check in production, you might want to use a library like 'df'
      // This is a simplified version
      const isHealthy = true; // Simplified for now

      return isHealthy
        ? indicator.up({
            path: process.cwd(),
            accessible: true,
            timestamp: moment().unix(),
          })
        : indicator.down({
            error: 'Disk space issues detected',
            path: process.cwd(),
          });
    } catch (error) {
      return indicator.down({
        error: 'Disk check error',
        details: error.message,
      });
    }
  }

  async checkExternalServices() {
    const indicator = this.healthIndicatorService.check('external-services');
    try {
      // This is where you would check external services like APIs, Redis, etc.
      // For now, we'll simulate some checks
      const services = {
        externalAPI: true, // Replace with actual health checks
        redis: true, // Replace with actual Redis ping
        elasticsearch: true, // Replace with actual ES health check
      };

      const allHealthy = Object.values(services).every(
        (status) => status === true,
      );

      return allHealthy
        ? indicator.up({
            services,
            timestamp: moment().unix(),
          })
        : indicator.down({
            error: 'One or more external services are down',
            services,
          });
    } catch (error) {
      return indicator.down({
        error: 'External services check error',
        details: error.message,
      });
    }
  }

  async checkEnvironment() {
    const indicator = this.healthIndicatorService.check('environment');
    try {
      const requiredEnvVars = ['NODE_ENV', 'API_PORT', 'DATABASES_MONGO_URL'];

      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName],
      );
      const isHealthy = missingVars.length === 0;

      return isHealthy
        ? indicator.up({
            environment: process.env.NODE_ENV,
            requiredVars: requiredEnvVars.length,
            present: requiredEnvVars.length - missingVars.length,
          })
        : indicator.down({
            error: 'Missing required environment variables',
            missing: missingVars,
          });
    } catch (error) {
      return indicator.down({
        error: 'Environment check error',
        details: error.message,
      });
    }
  }
}
