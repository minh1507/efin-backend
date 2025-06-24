import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsBoolean, IsArray, IsNumber, IsIn } from 'class-validator';
import { MessageEnum } from '../../../../common/enum/message.enum';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'app-mobile-123',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsString()
  @MaxLength(50)
  clientId!: string;

  @ApiProperty({
    description: 'Client Name',
    example: 'Mobile Application',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Client Secret',
    example: 'secretKey123',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientSecret?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Mobile app for customers',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Authorization type',
    example: 'RBAC',
    enum: ['RBAC', 'ABAC', 'ACL'],
  })
  @IsNotEmpty()
  @IsIn(['RBAC', 'ABAC', 'ACL'])
  authorizationType!: string;

  @ApiProperty({
    description: 'Supported authentication types',
    example: ['JWT', 'BASIC'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedAuthTypes?: string[];

  @ApiProperty({
    description: 'JWT Expiration time in seconds',
    example: 3600,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  jwtExpiresIn?: number;

  @ApiProperty({
    description: 'OAuth2 redirect URIs',
    example: ['http://localhost:3000/callback'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oauth2RedirectUris?: string[];

  @ApiProperty({
    description: 'OAuth2 scopes',
    example: ['read', 'write'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oauth2Scopes?: string[];
}

export class UpdateClientDto {
  @ApiProperty({
    description: 'Client Name',
    example: 'Mobile Application Updated',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Client Secret',
    example: 'newSecretKey123',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientSecret?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Updated mobile app description',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Client is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Authorization type',
    example: 'RBAC',
    enum: ['RBAC', 'ABAC', 'ACL'],
    required: false,
  })
  @IsOptional()
  @IsIn(['RBAC', 'ABAC', 'ACL'])
  authorizationType?: string;

  @ApiProperty({
    description: 'Supported authentication types',
    example: ['JWT', 'OAUTH2'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedAuthTypes?: string[];

  @ApiProperty({
    description: 'JWT Expiration time in seconds',
    example: 7200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  jwtExpiresIn?: number;

  @ApiProperty({
    description: 'OAuth2 redirect URIs',
    example: ['http://localhost:3000/callback', 'http://localhost:3001/callback'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oauth2RedirectUris?: string[];

  @ApiProperty({
    description: 'OAuth2 scopes',
    example: ['read', 'write', 'admin'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oauth2Scopes?: string[];
} 