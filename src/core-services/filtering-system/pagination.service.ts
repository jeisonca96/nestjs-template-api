import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { FilterQueryDto, SortOrder, PaginatedResponse } from './pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: Model<T>,
    query: FilterQuery<T>,
    dto: FilterQueryDto,
    populates: string[] = [],
    notAllowedFields: string[] = [],
  ): Promise<PaginatedResponse<T>> {
    if (dto.sortBy && notAllowedFields.includes(dto.sortBy)) {
      throw new BadRequestException(`Invalid sort field: ${dto.sortBy}`);
    }

    let queryBuilder = model
      .find(query)
      .sort({ [dto.sortBy]: dto.sortOrder === SortOrder.DESC ? -1 : 1 })
      .skip((dto.page - 1) * dto.limit)
      .limit(dto.limit);

    if (populates.length > 0) {
      populates.forEach((populate) => {
        queryBuilder = queryBuilder.populate(populate);
      });
    }

    const [results, total] = await Promise.all([
      queryBuilder.exec(),
      model.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: results,
      pagination: {
        total,
        page: dto.page,
        perPage: dto.limit,
        totalPages,
        nextPage: dto.page < totalPages ? dto.page + 1 : null,
        prevPage: dto.page > 1 ? dto.page - 1 : null,
      },
    };
  }
}
