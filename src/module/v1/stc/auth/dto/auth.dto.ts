import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

export enum AuthType {
  JWT = 'JWT',
  BASIC = 'BASIC_AUTH',
  OAUTH2 = 'OAUTH2',
}

export class LoginDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'client-uuid',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'admin',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_PASSWORD })
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'Authentication type',
    enum: AuthType,
    example: AuthType.JWT,
    required: false,
  })
  @IsOptional()
  @IsEnum(AuthType)
  authType?: AuthType = AuthType.JWT;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email?: string;
    fullName: string;
    role: {
      id: string;
      name: string;
      code: string;
    };
    client: {
      id: string;
      name: string;
      authorizationType: string;
    };
  };
  tokenType: string;
  expiresIn: number;

  constructor(
    accessToken: string, 
    refreshToken: string, 
    user: any,
    tokenType: string = 'Bearer',
    expiresIn: number = 3600
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    this.tokenType = tokenType;
    this.expiresIn = expiresIn;
  }
}

export class RegisterDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'client-uuid',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Role ID',
    example: 'role-uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  roleId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'newuser',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Email',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Full Name',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  fullName!: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_PASSWORD })
  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh-token-string',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}

export class ClientAuthDto {
  @ApiProperty({
    description: 'Client ID',
    example: 'client-uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  clientId!: string;

  @ApiProperty({
    description: 'Client Secret',
    example: 'client-secret',
  })
  @IsNotEmpty()
  @IsString()
  clientSecret!: string;
}
