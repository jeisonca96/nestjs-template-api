import { Injectable, LoggerService, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;

  setContext(context: string) {
    this.logger = new Logger(context || 'CustomLoggerService');

    return this;
  }

  log(message: string) {
    const traceId = this.getTraceId();
    this.logger.log(`[${traceId}] ${message}`);
  }

  error(message: string) {
    const traceId = this.getTraceId();
    this.logger.error(`[${traceId}] ${message}`);
  }

  warn(message: string) {
    const traceId = this.getTraceId();
    this.logger.warn(`[${traceId}] ${message}`);
  }

  debug(message: string) {
    const traceId = this.getTraceId();
    this.logger.debug(`[${traceId}] ${message}`);
  }

  verbose(message: string) {
    const traceId = this.getTraceId();
    this.logger.verbose(`[${traceId}] ${message}`);
  }

  private getTraceId(): string {
    const request = this.getRequestContext();
    return request['traceId'] || 'unknown';
  }

  private getRequestContext(): Request {
    return (global as any).__req__ || {};
  }
}
