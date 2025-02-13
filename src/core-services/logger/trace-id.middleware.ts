import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import {
  CustomLogger,
  CustomLoggerService,
} from '../logger/custom-logger.service';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  private logger: CustomLogger;

  constructor(private customLoggerService: CustomLoggerService) {
    this.logger = this.customLoggerService.createLogger('HTTP');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = crypto.randomBytes(16).toString('hex');
    req['traceId'] = traceId;
    res.setHeader('X-Trace-Id', traceId);

    (global as any).__req__ = req;

    const startTime = Date.now();
    const { method, originalUrl } = req;
    this.logger.log(`Incoming request ${method} ${originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `Response ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    res.on('error', (error) => {
      this.logger.error(
        `Request ${method} ${originalUrl} failed: ${error.message}`,
      );
    });

    next();
  }
}
