import { Global, Module } from '@nestjs/common';

import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule],
  exports: [LoggerModule],
})
export class CoreServicesModule {}
