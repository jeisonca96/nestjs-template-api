import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class UserNotFoundException extends BaseException {
  constructor(details?: string | object) {
    super('User not found', 'USER_NOT_FOUND', HttpStatus.BAD_REQUEST, details);
  }
}
