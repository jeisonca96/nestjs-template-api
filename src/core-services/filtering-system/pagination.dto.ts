import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Criterion } from './criteria-filtering.dto';
import { transformToCriteria } from './criteria.helper';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterQueryDto {
  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @Transform(({ value }) => transformToCriteria(value))
  @ValidateNested()
  @Type(() => Criterion)
  filters?: Criterion[];

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ enum: SortOrder, required: false })
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}
