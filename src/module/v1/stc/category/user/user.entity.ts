import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';
import { Role } from '../role/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, IsString } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';
import { Secret } from '../secret/secret.entity';
import { RefreshToken } from '../../refresh-token/refresh-token.entity';
import { Client } from '../../client/client.entity';

@Entity()
export class User extends RootEntity {
  @ApiProperty({
    description: 'Client ID',
  })
  @IsNotEmpty()
  @Column('uuid')
  clientId!: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client!: Client;
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column('uuid')
  roleId!: string;

  @ApiProperty({
    description: 'Username',
    example: 'admin',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  @IsString()
  @MaxLength(50, { message: MessageEnum.MAX_LENGTH_25 })
  @Column('varchar', {
    length: 50,
    nullable: false,
    unique: true,
  })
  username!: string;

  @ApiProperty({
    description: 'Email',
    example: 'admin@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @MaxLength(100)
  @Column('varchar', {
    length: 100,
    nullable: true,
    unique: true,
  })
  email?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'System Administrator',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(100, { message: MessageEnum.MAX_LENGTH_100 })
  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  fullName!: string;

  @ApiProperty({
    description: 'User is active',
    example: true,
  })
  @Column('boolean', {
    default: true,
  })
  isActive!: boolean;

  @OneToOne(() => Secret, { cascade: true })
  @JoinColumn({ name: 'secretId' })
  secret!: Secret;

  @Column('uuid')
  secretId!: string;

  @OneToOne(() => RefreshToken, { cascade: true })
  @JoinColumn({ name: 'refreshTokenId' })
  refreshToken?: RefreshToken;

  @Column('uuid', { nullable: true })
  refreshTokenId?: string;
}
