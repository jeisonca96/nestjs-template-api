import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CustomLogger,
  CustomLoggerService,
} from './logger/custom-logger.service';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { TraceIdInterceptor } from './logger/trace-id.interceptor';
import { TraceIdMiddleware } from './logger/trace-id.middleware';

@Module({
  providers: [
    CustomLoggerService,
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
  ],
  exports: [CustomLoggerService, CustomLogger],
})
export class CoreServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
