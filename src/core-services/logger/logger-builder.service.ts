import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Injectable()
export class LoggerBuilderService {
  build(context?: string) {
    return new CustomLoggerService().setContext(context);
  }
}
