import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailRepository } from './repositories/email.repository';
import { WhatsappRepository } from './repositories/whatsapp.repository';
import { NotificationsConfig } from './notifications.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    NotificationsConfig,
    NotificationRepository,
    EmailRepository,
    WhatsappRepository,
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
