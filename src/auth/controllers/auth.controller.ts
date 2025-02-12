import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  Inject,
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
import { GenerateApiKeyRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import {
  CustomLogger,
  CustomLoggerService,
} from '../../core-services/logger/custom-logger.service';

@Controller(ApiTagsEnum.Auth)
@ApiTags(ApiTagsEnum.Auth)
export class AuthController {
  private logger: CustomLogger;
  constructor(
    private authService: AuthService,
    private customLoggerService: CustomLoggerService,
  ) {
    this.logger = this.customLoggerService.createLogger(AuthController.name);
  }

  @Post('register')
  @RegisterApiDocs()
  async register(@Body() body: RegisterRequestDto) {
    this.logger.log(`Register auth username: ${body.username}`);
    return this.authService.register(body.username, body.password);
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
  async generateApiKey(
    @Body() body: GenerateApiKeyRequestDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Access denied, admin only');
    }

    const { apiKey, secret } = await this.authService.generateApiKey(
      body.name,
      user._id,
    );
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
