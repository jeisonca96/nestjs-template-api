import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
