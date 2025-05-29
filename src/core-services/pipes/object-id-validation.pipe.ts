import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
      throw new UnprocessableEntityException(
        'Invalid ID format',
        'INVALID_ID_FORMAT',
      );
    }
    return value;
  }
}
