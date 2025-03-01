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

  log(message: any, ...optionalParams: [...any, string?]) {
    const traceId = this.getTraceId();
    super.log(`[${traceId}] ${message}`, optionalParams);
  }

  error(message: any, ...optionalParams: [...any, string?]) {
    const traceId = this.getTraceId();
    super.error(`[${traceId}] ${message}`, optionalParams);
  }

  warn(message: any, ...optionalParams: [...any, string?]) {
    const traceId = this.getTraceId();
    super.warn(`[${traceId}] ${message}`, optionalParams);
  }

  debug(message: any, ...optionalParams: [...any, string?]) {
    const traceId = this.getTraceId();
    super.debug(`[${traceId}] ${message}`, optionalParams);
  }

  verbose(message: any, ...optionalParams: [...any, string?]) {
    const traceId = this.getTraceId();
    super.verbose(`[${traceId}] ${message}`, optionalParams);
  }
}
