import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class AlertsConfig {
  constructor(private readonly config: ConfigService) {}

  get adminAlertEmail(): string {
    return this.config.get<string>('ADMIN_EMAIL', 'admin@example.com');
  }

  get environment(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get alertTemplatesPath(): string {
    return path.join(__dirname, 'emailTemplates');
  }

  get adminAlertTemplatePath(): string {
    return path.join(this.alertTemplatesPath, 'admin-alert.hbs');
  }

  get severityLevels(): Record<string, { name: string; color: string }> {
    return {
      info: { name: 'Information', color: '#3498db' },
      warning: { name: 'Warning', color: '#f39c12' },
      error: { name: 'Error', color: '#e74c3c' },
      critical: { name: 'Critical', color: '#c0392b' },
    };
  }
}
