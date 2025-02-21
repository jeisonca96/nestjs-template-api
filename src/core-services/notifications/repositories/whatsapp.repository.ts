import { Injectable } from '@nestjs/common';
import { NotificationsConfig } from '../notifications.config';
import * as Twilio from 'twilio';

@Injectable()
export class WhatsappRepository {
  private client: Twilio.Twilio;

  constructor(private readonly config: NotificationsConfig) {
    const { accountSid, authToken } = this.config.whatsappConfig;
    this.client = Twilio(accountSid, authToken);
  }

  async sendMessage(to: string, message: string): Promise<void> {
    const { phoneNumber } = this.config.whatsappConfig;
    await this.client.messages.create({
      body: message,
      from: `whatsapp:${phoneNumber}`,
      to: `whatsapp:${to}`,
    });
  }
}
