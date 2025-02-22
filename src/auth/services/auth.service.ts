import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../config/auth.config';
import { getSecondsFromDuration } from '../helpers/auth.helper';
import { ApiKey } from '../schemas/api-key.schema';
import {
  CustomLogger,
  CustomLoggerService,
} from '../../core-services/logger/custom-logger.service';
import { OtpService } from '../../core-services/otp/otp.service';
import { NotificationsService } from '../../core-services/notifications/notifications.service';
import { RegisterRequestDto } from '../dtos/auth.dto';
import * as path from 'path';
import { VerificationTypes } from '../constants';

@Injectable()
export class AuthService {
  logger: CustomLogger;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ApiKey') private readonly apiKeyModel: Model<ApiKey>,
    private jwtService: JwtService,
    private readonly authConfig: AuthConfig,
    private readonly customLoggerService: CustomLoggerService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.logger = this.customLoggerService.createLogger(AuthService.name);
  }

  async sendWelcomeEmail(
    user: User,
    includeVerifyLink: boolean = false,
    userName?: string,
  ) {
    let verifyLink = undefined;
    let loginUrl = `${this.authConfig.frontendUrl}/login`;
    if (includeVerifyLink) {
      const accessToken = this.jwtService.sign(
        {
          sub: user._id,
          type: VerificationTypes.Email,
          version: user.tokenVersion,
        },
        { expiresIn: '1h' },
      );
      verifyLink = `${this.authConfig.baseUrl}/v1/auth/verify?token=${accessToken}`;
    }

    const context = {
      name: userName ?? user.username,
      verifyLink,
      loginUrl,
      currentYear: new Date().getFullYear(),
      companyName: this.authConfig.appName,
    };
    const templatePath = path.join(
      __dirname,
      '..',
      'emailTemplates',
      'welcome.text.hbs',
    );

    await this.notificationsService.sendEmail(
      user.email,
      'Welcome to our platform',
      templatePath,
      context,
    );
  }

  async sendPasswordChangeEmail(user: User, userName?: string) {
    const loginUrl = `${this.authConfig.frontendUrl}/login`;

    const context = {
      name: userName ?? user.username,
      companyName: this.authConfig.appName,
      changeDate: new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        dateStyle: 'long',
        timeStyle: 'short',
      }),
      currentYear: new Date().getFullYear(),
      loginUrl,
    };

    const templatePath = path.join(
      __dirname,
      '..',
      'emailTemplates',
      'password-change.hbs',
    );

    await this.notificationsService.sendEmail(
      user.email,
      'Password Changed Successfully',
      templatePath,
      context,
    );
  }

  async sendPasswordResetEmail(user: User, userName?: string) {
    const resetToken = this.jwtService.sign(
      { username: user.username, sub: user._id, version: user.tokenVersion },
      { expiresIn: '1h' },
    );

    const resetLink = `${this.authConfig.frontendUrl}/reset-password?token=${resetToken}`;

    const context = {
      name: userName ?? user.username,
      resetLink,
      expirationTime: 1,
      companyName: this.authConfig.appName,
      currentYear: new Date().getFullYear(),
      loginUrl: `${this.authConfig.frontendUrl}/login`,
    };

    const templatePath = path.join(
      __dirname,
      '..',
      'emailTemplates',
      'password-reset.hbs',
    );

    await this.notificationsService.sendEmail(
      user.email,
      'Password Reset Request',
      templatePath,
      context,
    );
  }

  async register(
    data: RegisterRequestDto,
    includeVerifyLink?: boolean,
    userName?: string,
  ): Promise<User> {
    this.logger.log(`Register username: ${data.username}`);

    const existUser = await this.userModel.exists({
      username: data.username,
    });
    if (existUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new this.userModel({
      username: data.username,
      email: data.email,
      phone: data.phoneNumber,
      password: hashedPassword,
    });

    const user = await newUser.save();
    user.password = undefined;

    await this.sendWelcomeEmail(user, includeVerifyLink, userName);

    this.logger.log(`Register success username: ${data.username}`);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async verifyUser(token: string) {
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.version) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (payload.type === VerificationTypes.Email) {
      user.isEmailVerified = true;
      user.isVerified = true;
    } else if (payload.type === VerificationTypes.Phone) {
      user.isPhoneVerified = true;
      user.isVerified = true;
    }
    user.tokenVersion += 1;

    await user.save();

    return { success: true, url: `${this.authConfig.frontendUrl}/login` };
  }

  async login(user: User) {
    this.logger.log(`Login username: ${user.username}`);

    const payload = {
      username: user.username,
      sub: user._id,
      version: user.tokenVersion,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.authConfig.authRefreshTokenExpiresIn,
    });
    this.logger.log(`Login success username: ${user.username}`);

    return {
      jwt: accessToken,
      expiration:
        Math.floor(Date.now() / 1000) +
        getSecondsFromDuration(this.authConfig.authTokenExpiresIn),
      refresh: refreshToken,
      refreshExpiration:
        Math.floor(Date.now() / 1000) +
        getSecondsFromDuration(this.authConfig.authRefreshTokenExpiresIn),
    };
  }

  async generateApiKey(
    name: string,
    userId: string,
  ): Promise<{ apiKey: string; secret: string }> {
    const apiKey = uuidv4();
    const secret = crypto.randomBytes(32).toString('base64');

    const hashedSecret = await bcrypt.hash(secret, 10);

    const newApiKey = new this.apiKeyModel({
      name,
      userId,
      apiKey,
      hashedSecret,
    });

    await newApiKey.save();

    return { apiKey, secret };
  }

  async validateApiKey(apiKey: string, secret: string): Promise<boolean> {
    const apiKeyRecord = await this.apiKeyModel.findOne({ apiKey });
    if (!apiKeyRecord) {
      return false;
    }

    const isValidSecret = await bcrypt.compare(
      secret,
      apiKeyRecord.hashedSecret,
    );

    return isValidSecret;
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  // TODO: implement blacklist
  async invalidateAllTokens(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
    });
  }

  async changePassword(userId: string, newPassword: string, userName?: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    await this.sendPasswordChangeEmail(user, userName);
  }

  async forgotPassword(email: string, userName?: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.sendPasswordResetEmail(user, userName);

    return { success: true };
  }
}
