import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { BasicAuthStrategy } from './strategies/auth.strategy';
import { JwtAuthStrategy } from './strategies/jwt.strategy'; // Importar la estrategia JWT
import { ApiKeyAuthStrategy } from './strategies/api-key.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from './config/auth.config';
import { ApiKeySchema } from './schemas/api-key.schema';
import { CoreServicesModule } from 'src/core-services/core-services.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'ApiKey', schema: ApiKeySchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.AUTH_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN,
      },
    }),
    CoreServicesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicAuthStrategy,
    JwtAuthStrategy,
    ApiKeyAuthStrategy,
    AuthConfig,
  ],
})
export class AuthModule {}
