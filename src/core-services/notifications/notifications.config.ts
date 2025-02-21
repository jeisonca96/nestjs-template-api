import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsConfig {
  constructor(private readonly config: ConfigService) {}

  get emailConfig() {
    return {
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get<number>('EMAIL_PORT', 587),
      secure: this.config.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
      from: this.config.get('EMAIL_FROM', '"No Reply" <noreply@example.com>'),
    };
  }

  get whatsappConfig() {
    return {
      accountSid: this.config.get('WHATSAPP_ACCOUNT_SID'),
      authToken: this.config.get('WHATSAPP_AUTH_TOKEN'),
      phoneNumber: this.config.get('WHATSAPP_PHONE_NUMBER'),
    };
  }
}
