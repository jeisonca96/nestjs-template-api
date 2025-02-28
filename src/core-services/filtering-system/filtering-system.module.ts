import { Module } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { PaginationService } from './pagination.service';

@Module({
  providers: [CriteriaService, PaginationService],
  exports: [CriteriaService, PaginationService],
})
export class FilteringSystemModule {}
