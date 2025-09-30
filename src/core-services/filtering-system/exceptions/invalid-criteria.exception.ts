import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class InvalidCriteriaException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Invalid criteria format',
      'INVALID_CRITERIA',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
