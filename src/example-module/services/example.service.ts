import { Injectable } from '@nestjs/common';
import {
  CustomLoggerService,
  CustomLogger,
} from '../../core-services/logger/custom-logger.service';
import { CreateExampleDto } from '../dtos/example.dto';
import { MessageTooLongException } from '../exceptions';

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

  postHello(createExampleDto: CreateExampleDto) {
    this.logger.log('Here post hello!');

    if (createExampleDto.message && createExampleDto.message.length > 100) {
      this.logger.warn(
        'Message length exceeds 100 characters, truncating to 100 characters.',
      );
      throw new MessageTooLongException();
    }

    return createExampleDto;
  }
}
