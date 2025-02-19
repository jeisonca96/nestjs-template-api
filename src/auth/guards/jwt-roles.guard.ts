import { Injectable } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import {
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class JwtAuthAndRolesGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtValid = await this.jwtAuthGuard.canActivate(context);
    if (!isJwtValid) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.rolesGuard.canActivate(context);
  }
}
