import { Type } from 'class-transformer';
import {
  IsEnum,
  ValidateNested,
  IsString,
  ValidateIf,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LogicalOperator {
  AND = 'and',
  OR = 'or',
}

export enum FilterOperator {
  /**
   * Equal: Matches values that are equal to the specified value.
   * Example: { field: { $eq: value } }
   */
  EQ = 'eq',

  /**
   * Not Equal: Matches values that are not equal to the specified value.
   * Example: { field: { $ne: value } }
   */
  NE = 'ne',

  /**
   * Greater Than: Matches values that are greater than the specified value.
   * Example: { field: { $gt: value } }
   */
  GT = 'gt',

  /**
   * Greater Than or Equal: Matches values that are greater than or equal to the specified value.
   * Example: { field: { $gte: value } }
   */
  GTE = 'gte',

  /**
   * Less Than: Matches values that are less than the specified value.
   * Example: { field: { $lt: value } }
   */
  LT = 'lt',

  /**
   * Less Than or Equal: Matches values that are less than or equal to the specified value.
   * Example: { field: { $lte: value } }
   */
  LTE = 'lte',

  /**
   * In: Matches any of the values specified in an array.
   * Example: { field: { $in: [value1, value2] } }
   */
  IN = 'in',

  /**
   * Not In: Matches none of the values specified in an array.
   * Example: { field: { $nin: [value1, value2] } }
   */
  NIN = 'nin',

  /**
   * Contains: Performs a partial text match (case-insensitive).
   * Example: { field: { $regex: /value/i } }
   */
  CONTAINS = 'contains',

  /**
   * Between: Matches values that are between two specified values (inclusive).
   * Example: { field: { $gte: startValue, $lte: endValue } }
   */
  BETWEEN = 'between',

  /**
   * Exists: Matches documents that contain the field, regardless of its value.
   * Example: { field: { $exists: true } }
   */
  EXISTS = 'exists',

  /**
   * Not Exists: Matches documents that do not contain the field.
   * Example: { field: { $exists: false } }
   */
  NOT_EXISTS = 'not_exists',

  /**
   * Regex: Matches values using a regular expression.
   * Example: { field: { $regex: /pattern/, $options: 'i' } }
   */
  REGEX = 'regex',

  /**
   * Array Contains: Matches arrays that contain all specified elements.
   * Example: { field: { $all: [value1, value2] } }
   */
  ARRAY_CONTAINS = 'array_contains',

  /**
   * Array Size: Matches arrays with a specific number of elements.
   * Example: { field: { $size: 3 } }
   */
  ARRAY_SIZE = 'array_size',

  /**
   * Element Match: Matches documents that contain an array field with at least one element that matches all specified criteria.
   * Example: { field: { $elemMatch: { subField: value } } }
   */
  ELEMENT_MATCH = 'elem_match',
}

export class Criterion {
  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf((o) => !o.logicalOperator)
  field?: string;

  @ApiProperty({ enum: FilterOperator, required: false })
  @IsEnum(FilterOperator)
  @ValidateIf((o) => !o.logicalOperator)
  operator?: FilterOperator;

  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.logicalOperator)
  value?: any;

  @ApiProperty({ enum: LogicalOperator, required: false })
  @IsEnum(LogicalOperator)
  @ValidateIf((o) => !o.field)
  logicalOperator?: LogicalOperator;

  @ApiProperty({ type: [Criterion], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Criterion)
  @ValidateIf((o) => !o.field)
  criteria?: Criterion[];
}
