import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../constants';

@Injectable()
export class AppConfig {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get('API_PORT', 3000);
  }

  get bodyLimit(): string {
    const bodyLimit = this.config.get('BODY_LIMIT');
    return bodyLimit ?? '2mb';
  }

  get baseUrl(): string {
    return this.config.get('BASE_URL', 'http://localhost:3000');
  }

  get corsOrigins(): string[] {
    const origins = this.config.get('CORS_ORIGINS');
    return origins ? origins.split(',') : ['*'];
  }

  get rateLimitWindow(): number {
    return this.config.get('RATE_LIMIT_WINDOW', 15 * 60 * 1000); // 15 minutes
  }

  get rateLimitMax(): number {
    return this.config.get('RATE_LIMIT_MAX', 100);
  }

  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === Environment.Production;
  }

  get isDevelopment(): boolean {
    return this.config.get('NODE_ENV') === Environment.Development;
  }
}
