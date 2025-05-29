import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreServicesModule } from './core-services/core-services.module';
import { ExampleModule } from './example-module/example.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASES_MONGO_URL),
    HealthModule,
    AuthModule,
    CoreServicesModule,
    ExampleModule,
  ],
  providers: [AppConfig],
})
export class AppModule {}
