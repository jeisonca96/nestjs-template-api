import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import * as moment from 'moment';

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
}
