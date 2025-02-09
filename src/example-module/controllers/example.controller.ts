import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExampleService } from '../services/example.service';
import { ApiTagsEnum } from '../../constants';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiTags(ApiTagsEnum.Example)
  @Get()
  getHello(): { message: string } {
    return this.exampleService.getHello();
  }
}
