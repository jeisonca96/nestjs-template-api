import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../exceptions/base.exception';

export class FileRequiredException extends BaseException {
  constructor(details?: string | object) {
    super('File is required', 'FILE_REQUIRED', HttpStatus.BAD_REQUEST, details);
  }
}
