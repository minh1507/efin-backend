import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'uuid-string',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Role code',
    example: 'MANAGER',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsString()
  @MaxLength(25)
  code!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Manager',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Description',
    example: 'Can manage users and configurations',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Role is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Updated Manager',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Updated description',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Role is active',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 