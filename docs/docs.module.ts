import { Module } from '@nestjs/common';
import { ExampleController } from '../src/example-module/controllers/example.controller';
import { ExampleService } from '../src/example-module/services/example.service';

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [{ provide: ExampleService, useValue: null }],
})
export class DocsModule {}
