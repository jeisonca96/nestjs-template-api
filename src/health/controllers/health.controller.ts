import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongo.pingCheck('mongodb', { timeout: 2000 }),
      () => this.healthService.checkApplication(),
      () => this.healthService.checkDatabase(),
    ]);
  }
}
