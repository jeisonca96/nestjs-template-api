import { Global, Module } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { OtpModule } from './otp/otp.module';
import { NotificationsModule } from './notifications/notifications.module';

@Global()
@Module({
  imports: [LoggerModule, OtpModule, NotificationsModule],
  exports: [LoggerModule, OtpModule, NotificationsModule],
})
export class CoreServicesModule {}
