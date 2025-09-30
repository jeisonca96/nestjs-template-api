import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Criterion, FilterOperator } from './criteria-filtering.dto';
import {
  InvalidBetweenException,
  FilteringNotAllowedException,
} from './exceptions';

@Injectable()
export class CriteriaService {
  buildQuery(
    criteria?: Criterion[],
    notAllowedFields: string[] = [],
  ): Record<string, any> {
    if (!criteria) return {};
    const conditions = this.parseCriteria(criteria, notAllowedFields);

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    return { $and: conditions };
  }

  private parseCriteria(
    criteria: Criterion[],
    notAllowedFields: string[],
  ): any[] {
    return criteria.map((criterion) => {
      if (criterion.logicalOperator && criterion.criteria) {
        return {
          [`$${criterion.logicalOperator}`]: this.parseCriteria(
            criterion.criteria,
            notAllowedFields,
          ),
        };
      }

      this.validateField(criterion.field!, notAllowedFields);
      return this.buildCondition(criterion);
    });
  }

  private buildCondition(criterion: Criterion): Record<string, any> {
    const { field, operator, value } = criterion;

    switch (operator) {
      case FilterOperator.CONTAINS:
        return { [field]: { $regex: value, $options: 'i' } };
      case FilterOperator.BETWEEN:
        return this.handleBetweenOperator(field, value);
      case FilterOperator.REGEX:
        return { [field]: { $regex: new RegExp(value, 'i') } };
      default:
        const mongoOperator = `$${operator}`;
        return {
          [field]: {
            [mongoOperator]: this.parseValue(value, operator),
          },
        };
    }
  }

  private handleBetweenOperator(
    field: string,
    value: any,
  ): Record<string, any> {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new InvalidBetweenException();
    }

    const [start, end] = value.map((v) =>
      this.parseValue(v, FilterOperator.BETWEEN),
    );
    return {
      [field]: {
        $gte: start,
        $lte: end,
      },
    };
  }

  private parseValue(value: any, operator: FilterOperator): any {
    if (
      operator === FilterOperator.CONTAINS ||
      operator === FilterOperator.REGEX
    ) {
      return new RegExp(value, 'i');
    }

    if (this.isDateString(value)) return new Date(value);
    if (this.isObjectId(value)) return new Types.ObjectId(String(value));

    return value;
  }

  private isDateString(value: any): boolean {
    return typeof value === 'string' && !isNaN(Date.parse(value));
  }

  private isObjectId(value: any): boolean {
    return Types.ObjectId.isValid(value);
  }

  private validateField(field: string, notAllowedFields: string[]) {
    if (notAllowedFields.includes(field)) {
      throw new FilteringNotAllowedException(field);
    }
  }
}
