import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { ApiTagsEnum } from '../../constants';
import { LoggerBuilderService } from '../../core-services/logger/logger-builder.service';
import { CustomLoggerService } from '../../core-services/logger/custom-logger.service';

@Controller(ApiTagsEnum.Example)
@ApiTags(ApiTagsEnum.Example)
export class ExampleController {
  private logger: CustomLoggerService;

  constructor(
    private readonly exampleService: ExampleService,
    private readonly loggerBuilder: LoggerBuilderService,
  ) {
    this.logger = this.loggerBuilder.build(ExampleController.name);
  }

  @Get()
  getHello(): { message: string } {
    this.logger.log('Here get hello!');
    return this.exampleService.getHello();
  }
}
