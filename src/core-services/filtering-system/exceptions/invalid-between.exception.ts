import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class InvalidBetweenException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Between operator requires an array of two values',
      'INVALID_BETWEEN',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
