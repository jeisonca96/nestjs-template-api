import { Injectable } from '@nestjs/common';
import { LoggerBuilderService } from '../../core-services/logger/logger-builder.service';
import { CustomLoggerService } from '../../core-services/logger/custom-logger.service';

@Injectable()
export class ExampleService {
  private logger: CustomLoggerService;

  constructor(private readonly loggerBuilder: LoggerBuilderService) {
    this.logger = this.loggerBuilder.build(ExampleService.name);
  }

  getHello(): { message: string } {
    this.logger.log('Here get hello!');

    return { message: 'Hello World!' };
  }
}
