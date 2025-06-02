import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreServicesModule } from './core-services/core-services.module';
import { ExampleModule } from './example-module/example.module';
import { ValidationModule } from './core-services/validation/validation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
    MongooseModule.forRoot(process.env.DATABASES_MONGO_URL),
    ValidationModule,
    HealthModule,
    AuthModule,
    CoreServicesModule,
    ExampleModule,
  ],
  providers: [AppConfig],
})
export class AppModule {}
