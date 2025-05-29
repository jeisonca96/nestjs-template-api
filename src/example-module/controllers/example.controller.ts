import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { ApiTagsEnum } from '../../constants';
import {
  CustomLoggerService,
  CustomLogger,
} from '../../core-services/logger/custom-logger.service';
import { CreateExampleDto } from '../dtos/example.dto';
import {
  CreateExampleApiDocs,
  GetExampleApiDocs,
} from '../apidocs/example.apidoc';

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
  @GetExampleApiDocs()
  getHello(): { message: string } {
    this.logger.log('Here get hello!');
    return this.exampleService.getHello();
  }

  @Post()
  @CreateExampleApiDocs()
  postHello(@Body() body: CreateExampleDto) {
    this.logger.log('Here post hello!');
    return this.exampleService.postHello(body);
  }
}
