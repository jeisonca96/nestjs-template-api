import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { Role } from '../constants';
import { JwtAuthAndRolesGuard } from '../guards/jwt-roles.guard';

export const ALLOWED_ROLES_KEY = 'allowedRoles';

export const AllowedRoles = (...roles: Role[]) =>
  applyDecorators(
    UseGuards(JwtAuthAndRolesGuard),
    SetMetadata(ALLOWED_ROLES_KEY, roles),
  );
