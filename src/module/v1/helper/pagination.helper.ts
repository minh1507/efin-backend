import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { PaginationDto, PaginationResult } from '../base/dto.base';

const logger = new Logger('PaginationHelper');

export interface PaginationOptions {
  page: number;
  limit: number;
  maxLimit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Paginate query results with enhanced validation and metadata
 */
export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
  maxLimit: number = 100,
): Promise<PaginationResult<T>> {
  const { page, limit } = validatePaginationParams(paginationDto, maxLimit);

  logger.debug(`Paginating query - Page: ${page}, Limit: ${limit}`);

  try {
    const [data, total] = await Promise.all([
      queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    logger.debug(`Pagination completed - Total: ${total}, Results: ${data.length}`);

    return new PaginationResult<T>(data, total, page, limit);
  } catch (error) {
    logger.error('Pagination failed:', error);
    throw new BadRequestException('Failed to paginate results');
  }
}

/**
 * Enhanced pagination function with detailed metadata
 */
export async function paginateWithMeta<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<PaginatedResult<T>> {
  const { page, limit } = validatePaginationParams(options, options.maxLimit);

  const [data, total] = await Promise.all([
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany(),
    queryBuilder.getCount(),
  ]);

  const totalPages = Math.ceil(total / limit);
  const meta: PaginationMeta = {
    currentPage: page,
    itemsPerPage: limit,
    totalItems: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { data, meta };
}

/**
 * Validate pagination parameters
 */
function validatePaginationParams(
  params: { page: number; limit: number },
  maxLimit: number = 100,
): { page: number; limit: number } {
  const { page, limit } = params;

  if (page < 1) {
    throw new BadRequestException('Page must be greater than 0');
  }

  if (limit < 1) {
    throw new BadRequestException('Limit must be greater than 0');
  }

  if (limit > maxLimit) {
    throw new BadRequestException(`Limit cannot exceed ${maxLimit}`);
  }

  return { page, limit };
}
