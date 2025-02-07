import { ConflictException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../config/auth.config';
import { getSecondsFromDuration } from '../helpers/auth.helper';
import { ApiKey } from '../schemas/api-key.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('ApiKey') private readonly apiKeyModel: Model<ApiKey>,
    private jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  async register(username: string, password: string): Promise<User> {
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
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.authConfig.authRefreshTokenExpiresIn,
    });

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
    userId: string,
  ): Promise<{ apiKey: string; secret: string }> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const secret = crypto.randomBytes(32).toString('hex');

    const hashedSecret = await bcrypt.hash(secret, 10);

    const existingApiKey = await this.apiKeyModel.findOne({ userId });
    if (existingApiKey) {
      throw new ConflictException('API key already exists for this user');
    }

    const newApiKey = new this.apiKeyModel({
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
