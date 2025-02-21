import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto, PaginationResult } from '../base/dto.base';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
): Promise<PaginationResult<T>> {
  const { page, limit } = paginationDto;

  const [data, total] = await Promise.all([
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany(),
    queryBuilder.getCount(),
  ]);

  return new PaginationResult<T>(data, total, page, limit);
}
