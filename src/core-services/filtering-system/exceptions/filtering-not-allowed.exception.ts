import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class FilteringNotAllowedException extends BaseException {
  constructor(field: string, details?: string | object) {
    super(
      `Filtering by ${field} is not allowed`,
      'FILTERING_NOT_ALLOWED',
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
