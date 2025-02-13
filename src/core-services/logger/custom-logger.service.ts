import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomLoggerService {
  createLogger(context: string) {
    return new CustomLogger(context);
  }
}

export class CustomLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  private getTraceId(): string {
    const request = this.getRequest();
    return request?.['traceId'] || 'unknown';
  }

  private getRequest(): Request | null {
    return (global as any).__req__ || null;
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
