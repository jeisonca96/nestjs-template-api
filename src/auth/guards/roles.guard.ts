import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOWED_ROLES_KEY } from '../decorators/allowed-roles.decorator';
import { Roles } from '../constants';
import {
  UserNoRolesException,
  InsufficientPermissionsException,
} from '../exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Roles[]>(
      ALLOWED_ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roles?.length) {
      throw new UserNoRolesException();
    }

    const hasPermission = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasPermission) {
      throw new InsufficientPermissionsException();
    }

    return true;
  }
}
