import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { OtpModule } from './otp/otp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilteringSystemModule } from './filtering-system/filtering-system.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    OtpModule,
    NotificationsModule,
    FilteringSystemModule,
  ],
  exports: [
    LoggerModule,
    OtpModule,
    NotificationsModule,
    FilteringSystemModule,
  ],
})
export class CoreServicesModule {}
