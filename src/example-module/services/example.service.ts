import { Injectable } from '@nestjs/common';
import {
  CustomLoggerService,
  CustomLogger,
} from '../../core-services/logger/custom-logger.service';

@Injectable()
export class ExampleService {
  private logger: CustomLogger;

  constructor(private readonly customLoggerService: CustomLoggerService) {
    this.logger = this.customLoggerService.createLogger(ExampleService.name);
  }

  getHello(): { message: string } {
    this.logger.log('Here get hello!');

    return { message: 'Hello World!' };
  }
}
