import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { InvalidIdFormatException } from './exceptions';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
      throw new InvalidIdFormatException();
    }
    return value;
  }
}
