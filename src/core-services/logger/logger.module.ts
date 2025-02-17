import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomLogger, CustomLoggerService } from './custom-logger.service';
import { TraceIdMiddleware } from './trace-id.middleware';
import { AsyncLocalStorageService } from './async-local-storage.service';

@Module({
  providers: [CustomLoggerService, CustomLogger, AsyncLocalStorageService],
  exports: [CustomLoggerService, CustomLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
