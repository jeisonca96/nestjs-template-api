import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { InvalidTokenException } from '../exceptions';
import { AuthConfig } from '../config/auth.config';
import { User } from '../schemas/user.schema';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private readonly authConfig: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.authSecretKey,
    });
  }

  async validate(payload: { sub: string; version: number }): Promise<User> {
    const user = await this.authService.findUserById(payload.sub);
    if (!user || user.tokenVersion !== payload.version) {
      throw new InvalidTokenException();
    }
    return user;
  }
}
