import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private server: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  serverHealthCheck() {
    return this.health.check([async () => this.server.check('server')]);
  }
}
