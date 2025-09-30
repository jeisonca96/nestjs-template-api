import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class ApiKeyRequiredException extends BaseException {
  constructor(details?: string | object) {
    super(
      'API Key and Secret required',
      'API_KEY_REQUIRED',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
