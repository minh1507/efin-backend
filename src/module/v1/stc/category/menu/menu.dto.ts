import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  path: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  parentId: string;
}