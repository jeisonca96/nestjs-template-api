import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class InvalidSortFieldException extends BaseException {
  constructor(field: string, details?: string | object) {
    super(
      `Invalid sort field: ${field}`,
      'INVALID_SORT_FIELD',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
