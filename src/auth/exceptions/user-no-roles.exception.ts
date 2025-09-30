import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class UserNoRolesException extends BaseException {
  constructor(details?: string | object) {
    super(
      'User has no roles assigned',
      'USER_NO_ROLES',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
