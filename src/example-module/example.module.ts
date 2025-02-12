import { Module } from '@nestjs/common';
import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';
import { CoreServicesModule } from 'src/core-services/core-services.module';

@Module({
  imports: [CoreServicesModule],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
