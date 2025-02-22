import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  constructor(private readonly config: ConfigService) {}

  get authTokenExpiresIn(): string {
    return this.config.get('AUTH_TOKEN_EXPIRES_IN', '1h');
  }

  get authRefreshTokenExpiresIn(): string {
    return this.config.get('AUTH_REFRESH_TOKEN_EXPIRES_IN', '7d');
  }

  get authSecretKey(): string {
    return this.config.get('AUTH_SECRET_KEY', 'secret');
  }

  get frontendUrl(): string {
    return this.config.get('FRONTEND_URL', 'http://localhost:3000');
  }

  get baseUrl(): string {
    return this.config.get('BASE_URL', 'http://localhost:3000');
  }

  get appName(): string {
    return this.config.get('APP_NAME', 'NestJS App');
  }
}
