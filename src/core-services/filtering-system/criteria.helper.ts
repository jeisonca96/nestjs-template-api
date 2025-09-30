import { plainToInstance } from 'class-transformer';
import { Criterion, LogicalOperator } from './criteria-filtering.dto';
import { InvalidCriteriaException } from './exceptions';

export function transformToCriteria(value: any): Criterion[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return convertCriteria(parsed);
  } catch (error) {
    throw new InvalidCriteriaException();
  }
}

export function convertCriteria(obj: any): Criterion[] {
  if (Array.isArray(obj))
    return obj.map((item) => convertSingleCriterion(item));

  const criteria: Criterion[] = [];
  for (const key in obj) {
    if (key === 'or' || key === 'and') {
      criteria.push(
        plainToInstance(Criterion, {
          logicalOperator:
            key === 'or' ? LogicalOperator.OR : LogicalOperator.AND,
          criteria: convertCriteria(obj[key]),
        }),
      );
    } else {
      const field = key;
      const operator = Object.keys(obj[key])[0];
      const value = obj[key][operator];
      criteria.push(plainToInstance(Criterion, { field, operator, value }));
    }
  }
  return criteria;
}

export function convertSingleCriterion(item: any): Criterion {
  if (item.or || item.and) {
    return plainToInstance(Criterion, {
      logicalOperator: item.or ? LogicalOperator.OR : LogicalOperator.AND,
      criteria: convertCriteria(item.or || item.and),
    });
  } else {
    const field = Object.keys(item)[0];
    const operator = Object.keys(item[field])[0];
    const value = item[field][operator];
    return plainToInstance(Criterion, { field, operator, value });
  }
}
