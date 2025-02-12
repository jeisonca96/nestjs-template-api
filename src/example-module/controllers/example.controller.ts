import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { ApiTagsEnum } from '../../constants';
import {
  CustomLoggerService,
  CustomLogger,
} from '../../core-services/logger/custom-logger.service';

@Controller(ApiTagsEnum.Example)
@ApiTags(ApiTagsEnum.Example)
export class ExampleController {
  private logger: CustomLogger;

  constructor(
    private readonly exampleService: ExampleService,
    private readonly customLoggerService: CustomLoggerService,
  ) {
    this.logger = this.customLoggerService.createLogger(ExampleController.name);
  }

  @Get()
  getHello(): { message: string } {
    this.logger.log('Here get hello!');
    return this.exampleService.getHello();
  }
}
