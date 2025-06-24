import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID, IsBoolean, IsNumber } from 'class-validator';
import { MessageEnum } from '../../../../common/enum/message.enum';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'uuid-string',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Menu name',
    example: 'User Management',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Menu path/URL',
    example: '/users',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  path!: string;

  @ApiProperty({
    description: 'Menu icon',
    example: 'users',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: 'Menu is visible',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateMenuDto {
  @ApiProperty({
    description: 'Menu name',
    example: 'Updated Menu Name',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Menu path/URL',
    example: '/updated-path',
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  path?: string;

  @ApiProperty({
    description: 'Menu icon',
    example: 'updated-icon',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: 'Menu is visible',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
} 