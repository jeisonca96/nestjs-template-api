import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class InvalidTokenException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Invalid or expired token',
      'INVALID_TOKEN',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
