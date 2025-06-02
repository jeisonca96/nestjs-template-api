import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongo.pingCheck('mongodb', { timeout: 2000 }),
      () => this.healthService.checkApplication(),
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkEnvironment(),
    ]);
  }

  @Get('detailed')
  @HealthCheck()
  detailedCheck() {
    return this.health.check([
      () => this.mongo.pingCheck('mongodb', { timeout: 2000 }),
      () =>
        this.disk.checkStorage('disk', {
          path: process.cwd(),
          thresholdPercent: 0.9,
        }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () => this.healthService.checkApplication(),
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkMemory(),
      () => this.healthService.checkDisk(),
      () => this.healthService.checkExternalServices(),
      () => this.healthService.checkEnvironment(),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([() => this.healthService.checkApplication()]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.mongo.pingCheck('mongodb', { timeout: 2000 }),
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkEnvironment(),
    ]);
  }
}
