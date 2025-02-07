import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyAuthStrategy } from '../strategies/api-key.strategy';
import { JwtAuthStrategy } from '../strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, password);
  }

  @Post('login')
  @UseGuards(AuthGuard('basic'))
  async login(@Body() body: any, @Req() request: Request) {
    const user = request['user'];
    return this.authService.login(user);
  }

  @Post('generate-apikey')
  @UseGuards(AuthGuard('jwt'))
  async generateApiKey(@Req() request: Request) {
    const user = request['user'];
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Access denied, admin only');
    }

    const { apiKey, secret } = await this.authService.generateApiKey(user._id);
    return { apiKey, secret };
  }

  @Post('validate-apikey')
  @UseGuards(AuthGuard('apikey'))
  @HttpCode(200)
  async validateApiKey() {
    return { message: 'API key and secret are valid' };
  }
}
