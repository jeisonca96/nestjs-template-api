import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Invalid credentials',
      'INVALID_CREDENTIALS',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
