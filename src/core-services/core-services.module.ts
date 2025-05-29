import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { OtpModule } from './otp/otp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilteringSystemModule } from './filtering-system/filtering-system.module';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';
import { AlertsModule } from './alerts/alerts.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    AlertsModule,
    OtpModule,
    NotificationsModule,
    FilteringSystemModule,
    CloudStorageModule,
  ],
  exports: [
    LoggerModule,
    AlertsModule,
    OtpModule,
    NotificationsModule,
    FilteringSystemModule,
  ],
})
export class CoreServicesModule {}
