import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/module/v1/base/dto.base';

export class CreateEthnicDto {
  @ApiProperty({
    description: 'Name',
    example: 'Kinh',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Code',
    example: 'KINH',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  code: string;
}

export class FindDto extends PaginationDto {}
