import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  Get,
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ChangePasswordApiDocs,
  ForgotPasswordApiDocs,
  GenerateApiKeyApiDocs,
  LoginApiDocs,
  RegisterApiDocs,
  ValidateApiKeyApiDocs,
} from '../apidocs/auth.apidocs';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum } from '../../constants';
import {
  ChangePasswordRequestDto,
  ForgotPasswordRequestDto,
  GenerateApiKeyRequestDto,
  RegisterRequestDto,
} from '../dtos/auth.dto';
import {
  CustomLogger,
  CustomLoggerService,
} from '../../core-services/logger/custom-logger.service';
import { AllowedRoles } from '../decorators/allowed-roles.decorator';
import { Role } from '../constants';

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
    return this.authService.register(body, true);
  }

  @Post('login')
  @LoginApiDocs()
  @UseGuards(AuthGuard('basic'))
  async login(@Req() request: Request) {
    const user = request['user'];
    return this.authService.login(user);
  }

  @Post('logout')
  @AllowedRoles(Role.User)
  @HttpCode(204)
  async logout(@Req() request: Request) {
    const user = request['user'];
    await this.authService.invalidateAllTokens(user._id);
  }

  @Post('generate-apikey')
  @GenerateApiKeyApiDocs()
  @AllowedRoles(Role.Admin)
  async generateApiKey(
    @Body() body: GenerateApiKeyRequestDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
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

  @Get('verify')
  @Redirect()
  @HttpCode(302)
  async verifyEmail(@Query('token') token: string) {
    const { url } = await this.authService.verifyUser(token);

    return { url };
  }

  @Post('change-password')
  @AllowedRoles(Role.User)
  @ChangePasswordApiDocs()
  @HttpCode(204)
  async changePassword(
    @Body() body: ChangePasswordRequestDto,
    @Req() request: Request,
  ) {
    const user = request['user'];
    await this.authService.changePassword(user._id, body.newPassword);
  }

  @Post('forgot-password')
  @ForgotPasswordApiDocs()
  @HttpCode(204)
  async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
    await this.authService.forgotPassword(body.email);
  }
}
