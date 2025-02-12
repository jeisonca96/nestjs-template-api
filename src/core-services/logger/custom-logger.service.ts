import { Injectable, Logger } from '@nestjs/common';

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

  private getTraceId(): string {
    const request = (global as any).__req__ || {};
    return request['traceId'] || 'unknown';
  }
}
