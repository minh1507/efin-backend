import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page numner',
    example: '1',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  page: number;

  @ApiProperty({
    description: 'Limit',
    example: '1',
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  limit: number;
}

export class PaginationResult<T> {
  content: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);

    this.content = data;
    this.meta = {
      total,
      perPage: limit,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }
}
