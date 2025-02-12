import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = crypto.randomBytes(16).toString('hex');
    req['traceId'] = traceId;
    res.setHeader('X-Trace-Id', traceId);
    next();
  }
}
