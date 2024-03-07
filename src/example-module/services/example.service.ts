import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  getHello(): { message: string } {
    this.logger.log('Here get hello!');

    return { message: 'Hello World!' };
  }
}
