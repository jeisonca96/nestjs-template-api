import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../services/auth.service';
import { ApiKeyRequiredException, InvalidApiKeyException } from '../exceptions';

@Injectable()
export class ApiKeyAuthStrategy extends PassportStrategy(Strategy, 'apikey') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const apiKey = request.headers['x-api-key'] as string;
    const secret = request.headers['x-api-secret'] as string;

    if (!apiKey || !secret) {
      throw new ApiKeyRequiredException();
    }

    const isValid = await this.authService.validateApiKey(apiKey, secret);
    if (!isValid) {
      throw new InvalidApiKeyException();
    }

    return { apiKey, secret };
  }
}
