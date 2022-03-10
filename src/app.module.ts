import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { ExampleModule } from './example-module/example.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, ExampleModule],
  providers: [AppConfig],
})
export class AppModule {}
