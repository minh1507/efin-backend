import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MessageEnum } from '../../../../common/enum/message.enum';
import { RootEntity } from '../../../../common/base/rootEntity.base';

@Entity('clients')
export class Client extends RootEntity {
  @ApiProperty({
    description: 'Client ID',
    example: 'app-mobile-123',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsString()
  @MaxLength(50)
  @Column('varchar', {
    length: 50,
    nullable: false,
    unique: true,
  })
  clientId!: string;

  @ApiProperty({
    description: 'Client Name',
    example: 'Mobile Application',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100)
  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: 'Client Secret (hashed)',
  })
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  clientSecret?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Mobile app for customers',
    maxLength: 255,
  })
  @MaxLength(255)
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Client is active',
    example: true,
  })
  @Column('boolean', {
    default: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Authorization type',
    example: 'RBAC',
    enum: ['RBAC', 'ABAC', 'ACL'],
  })
  @IsNotEmpty()
  @Column('varchar', {
    length: 20,
    default: 'RBAC',
  })
  authorizationType!: string;

  @ApiProperty({
    description: 'Supported authentication types (JSON array)',
    example: ['JWT', 'BASIC'],
  })
  @Column('json', {
    nullable: true,
  })
  supportedAuthTypes?: string[];

  @ApiProperty({
    description: 'JWT Secret Key',
  })
  @Column('text', {
    nullable: true,
  })
  jwtSecret?: string;

  @ApiProperty({
    description: 'JWT Expiration time in seconds',
    example: 3600,
  })
  @Column('int', {
    nullable: true,
    default: 3600,
  })
  jwtExpiresIn?: number;

  @ApiProperty({
    description: 'OAuth2 redirect URIs (JSON array)',
  })
  @Column('json', {
    nullable: true,
  })
  oauth2RedirectUris?: string[];

  @ApiProperty({
    description: 'OAuth2 scopes (JSON array)',
  })
  @Column('json', {
    nullable: true,
  })
  oauth2Scopes?: string[];
} 