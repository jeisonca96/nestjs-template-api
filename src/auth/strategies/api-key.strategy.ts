import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyAuthStrategy extends PassportStrategy(Strategy, 'apikey') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const apiKey = request.headers['x-api-key'] as string;
    const secret = request.headers['x-api-secret'] as string;

    if (!apiKey || !secret) {
      throw new UnauthorizedException('API Key and Secret required');
    }

    const isValid = await this.authService.validateApiKey(apiKey, secret);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API Key or Secret');
    }

    return { apiKey, secret };
  }
}
