import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class UsernameExistsException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Username already exists',
      'USERNAME_EXISTS',
      HttpStatus.CONFLICT,
      details,
    );
  }
}
