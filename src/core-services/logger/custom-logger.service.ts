import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorageService } from './async-local-storage.service';

@Injectable()
export class CustomLoggerService {
  constructor(private asyncLocalStorage: AsyncLocalStorageService) {}

  createLogger(context: string) {
    return new CustomLogger(context, this.asyncLocalStorage);
  }
}

export class CustomLogger extends Logger {
  constructor(
    context: string,
    private asyncLocalStorage: AsyncLocalStorageService,
  ) {
    super(context);
  }

  private getTraceId(): string {
    const store = this.asyncLocalStorage.getStore();
    const request = store?.get('request');
    return request?.['traceId'] || 'unknown';
  }

  log(message: string) {
    const traceId = this.getTraceId();
    super.log(`[${traceId}] ${message}`);
  }

  error(message: string) {
    const traceId = this.getTraceId();
    super.error(`[${traceId}] ${message}`);
  }

  warn(message: string) {
    const traceId = this.getTraceId();
    super.warn(`[${traceId}] ${message}`);
  }

  debug(message: string) {
    const traceId = this.getTraceId();
    super.debug(`[${traceId}] ${message}`);
  }

  verbose(message: string) {
    const traceId = this.getTraceId();
    super.verbose(`[${traceId}] ${message}`);
  }
}
