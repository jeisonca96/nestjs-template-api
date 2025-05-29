import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsService } from './alerts.service';
import { AlertsConfig } from './alerts.config';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ConfigModule, forwardRef(() => NotificationsModule)],
  providers: [AlertsConfig, AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
