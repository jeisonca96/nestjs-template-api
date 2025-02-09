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
import {
  GenerateApiKeyApiDocs,
  LoginApiDocs,
  RegisterApiDocs,
  ValidateApiKeyApiDocs,
} from '../apidocs/auth.apidocs';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum } from '../../constants';

@Controller(ApiTagsEnum.Auth)
@ApiTags(ApiTagsEnum.Auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @RegisterApiDocs()
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(username, password);
  }

  @Post('login')
  @LoginApiDocs()
  @UseGuards(AuthGuard('basic'))
  async login(@Req() request: Request) {
    const user = request['user'];
    return this.authService.login(user);
  }

  @Post('generate-apikey')
  @GenerateApiKeyApiDocs()
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
  @ValidateApiKeyApiDocs()
  @HttpCode(200)
  async validateApiKey() {
    return { message: 'API key and secret are valid' };
  }
}
