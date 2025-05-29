import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from './repositories/notification.repository';
import { EmailRepository } from './repositories/email.repository';
import { WhatsappRepository } from './repositories/whatsapp.repository';
import { NotificationsConfig } from './notifications.config';
import { ConfigModule } from '@nestjs/config';
import { FileTokenProvider } from './repositories/file-token.provider';
import { GoogleCalendarRepository } from './repositories/google-calendar.repository';
import { NotificationController } from './notification.controller';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    forwardRef(() => AlertsModule),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationsConfig,
    NotificationRepository,
    EmailRepository,
    WhatsappRepository,
    GoogleCalendarRepository,
    NotificationsService,
    FileTokenProvider,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
