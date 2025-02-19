import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOWED_ROLES_KEY } from '../decorators/allowed-roles.decorator';
import { Role } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ALLOWED_ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roles?.length) {
      throw new UnauthorizedException('User has no roles assigned');
    }

    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
