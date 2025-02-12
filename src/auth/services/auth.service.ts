import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../config/auth.config';
import { getSecondsFromDuration } from '../helpers/auth.helper';
import { ApiKey } from '../schemas/api-key.schema';
import { CustomLoggerService } from '../../core-services/logger/custom-logger.service';
import { LoggerBuilderService } from '../../core-services/logger/logger-builder.service';

@Injectable()
export class AuthService {
  private logger: CustomLoggerService;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ApiKey') private readonly apiKeyModel: Model<ApiKey>,
    private jwtService: JwtService,
    private readonly authConfig: AuthConfig,
    private readonly loggerBuilder: LoggerBuilderService,
  ) {
    this.logger = this.loggerBuilder.build(AuthService.name);
  }

  async register(username: string, password: string): Promise<User> {
    this.logger.log(`Register username: ${username}`);

    const existUser = await this.userModel.findOne({
      username,
    });
    if (existUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
    });

    const user = await newUser.save();
    user.password = undefined;

    this.logger.log(`Register success username: ${username}`);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    this.logger.log(`Login username: ${user.username}`);

    const payload = { username: user.username, sub: user._id };
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
    const apiKey = crypto.randomBytes(32).toString('base64');
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
}
