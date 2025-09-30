import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class PathRequiredException extends BaseException {
  constructor(details?: string | object) {
    super('Path is required', 'PATH_REQUIRED', HttpStatus.BAD_REQUEST, details);
  }
}
