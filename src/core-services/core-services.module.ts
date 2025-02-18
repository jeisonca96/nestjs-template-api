import { Global, Module } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';
import { OtpModule } from './otp/otp.module';

@Global()
@Module({
  imports: [LoggerModule, OtpModule],
  exports: [LoggerModule, OtpModule],
})
export class CoreServicesModule {}
