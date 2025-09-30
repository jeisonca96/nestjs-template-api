import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../core-services/exceptions/base.exception';

export class InvalidApiKeyException extends BaseException {
  constructor(details?: string | object) {
    super(
      'Invalid API Key or Secret',
      'INVALID_API_KEY',
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}
