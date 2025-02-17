import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import {
  CustomLogger,
  CustomLoggerService,
} from '../logger/custom-logger.service';
import { AsyncLocalStorageService } from './async-local-storage.service';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  private logger: CustomLogger;

  constructor(
    private customLoggerService: CustomLoggerService,
    private asyncLocalStorage: AsyncLocalStorageService,
  ) {
    this.logger = this.customLoggerService.createLogger('HTTP');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = crypto.randomBytes(16).toString('hex');
    req['traceId'] = traceId;
    res.setHeader('X-Trace-Id', traceId);

    const store = new Map<string, any>();
    store.set('request', req);

    this.asyncLocalStorage.run(store, () => {
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
    });
  }
}
