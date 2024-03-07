import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { NestjsTemplateApiTags } from '../../constants';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiTags(NestjsTemplateApiTags.Example)
  @Get()
  getHello(): { message: string } {
    return this.exampleService.getHello();
  }
}
