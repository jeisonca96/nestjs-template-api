import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { ExampleModule } from './example-module/example.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASES_MONGO_URL),
    HealthModule,
    ExampleModule,
    AuthModule,
  ],
  providers: [AppConfig],
})
export class AppModule {}
