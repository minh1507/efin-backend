import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID, IsBoolean, IsEmail } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'uuid-string',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Role ID',
    example: 'uuid-string',
  })
  @IsNotEmpty()
  @IsUUID()
  roleId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  @IsString()
  @MaxLength(50)
  username!: string;

  @ApiProperty({
    description: 'Email',
    example: 'john@example.com',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: 'Full Name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100)
  fullName!: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'User is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Role ID',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty({
    description: 'Email',
    example: 'newemail@example.com',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({
    description: 'Full Name',
    example: 'Updated Name',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({
    description: 'User is active',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
} 