import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import * as moment from 'moment';

@Injectable()
export class HealthService extends HealthIndicator {
  public check(key: string) {
    const isHealthy = true;
    const version = process.env.npm_package_version;
    return super.getStatus(key, isHealthy, {
      version,
      utc: moment.utc().format(),
      local: moment().format(),
    });
  }
}
