import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { BasicAuthStrategy } from './strategies/auth.strategy';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from './config/auth.config';
import { ApiKeySchema } from './schemas/api-key.schema';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthAndRolesGuard } from './guards/jwt-roles.guard';
import { ApiKeyAuthStrategy } from './strategies/api-key.strategy';

@Global()
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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasicAuthStrategy,
    JwtAuthStrategy,
    ApiKeyAuthStrategy,
    AuthConfig,
    JwtAuthGuard,
    RolesGuard,
    JwtAuthAndRolesGuard,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard, JwtAuthAndRolesGuard],
})
export class AuthModule {}
