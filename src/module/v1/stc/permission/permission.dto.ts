import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsIn, IsUUID } from 'class-validator';
import { MessageEnum } from '../../../../common/enum/message.enum';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'uuid-string',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;


  @ApiProperty({
    description: 'Resource name',
    example: 'users',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(50)
  resource!: string;

  @ApiProperty({
    description: 'Action',
    example: 'read',
    enum: ['create', 'read', 'update', 'delete', 'list'],
  })
  @IsNotEmpty()
  @IsIn(['create', 'read', 'update', 'delete', 'list'])
  action!: string;

  @ApiProperty({
    description: 'Description',
    example: 'Can read user information',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;
}

export class UpdatePermissionDto {

  @ApiProperty({
    description: 'Resource name',
    example: 'users',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  resource?: string;

  @ApiProperty({
    description: 'Action',
    example: 'update',
    enum: ['create', 'read', 'update', 'delete', 'list'],
    required: false,
  })
  @IsOptional()
  @IsIn(['create', 'read', 'update', 'delete', 'list'])
  action?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Updated description',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;
} 