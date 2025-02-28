import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { Roles } from '../constants';
import { JwtAuthAndRolesGuard } from '../guards/jwt-roles.guard';

export const ALLOWED_ROLES_KEY = 'allowedRoles';

export const AllowedRoles = (...roles: Roles[]) =>
  applyDecorators(
    UseGuards(JwtAuthAndRolesGuard),
    SetMetadata(ALLOWED_ROLES_KEY, roles),
  );
