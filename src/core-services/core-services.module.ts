import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomLoggerService } from './logger/custom-logger.service';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { TraceIdInterceptor } from './logger/trace-id.interceptor';
import { TraceIdMiddleware } from './logger/trace-id.middleware';
import { LoggerBuilderService } from './logger/logger-builder.service';

@Module({
  providers: [
    CustomLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
    LoggerBuilderService,
  ],
  exports: [LoggerBuilderService],
})
export class CoreServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
