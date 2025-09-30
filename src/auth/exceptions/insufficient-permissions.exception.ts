import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class InsufficientPermissionsException extends BaseException {
  constructor(details?: string | object) {
    super(
      'You do not have permission to access this resource',
      'INSUFFICIENT_PERMISSIONS',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
