import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CustomLogger,
  CustomLoggerService,
} from './logger/custom-logger.service';
import { TraceIdMiddleware } from './logger/trace-id.middleware';
import { AsyncLocalStorageService } from './logger/async-local-storage.service';

@Module({
  providers: [CustomLoggerService, CustomLogger, AsyncLocalStorageService],
  exports: [CustomLoggerService, CustomLogger],
})
export class CoreServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
