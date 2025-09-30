import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class InvalidIdFormatException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Invalid ID format',
      'INVALID_ID_FORMAT',
      HttpStatus.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}
