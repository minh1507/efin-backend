import { Entity, OneToMany, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../../common/base/entity.base';
import { User } from '../user/user.entity';
import { Client } from '../../client/client.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

@Entity()
export class Role extends BaseEntity {
  @ApiProperty({
    description: 'Client ID',
  })
  @IsNotEmpty()
  @Column('uuid')
  clientId!: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client!: Client;

  @ApiProperty({
    description: 'Role code',
    example: 'ADMIN',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @IsString()
  @MaxLength(25)
  @Column('varchar', {
    length: 25,
    nullable: false,
  })
  code!: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Administrator',
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
    description: 'Description',
    example: 'Full system access',
    maxLength: 255,
  })
  @MaxLength(255)
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Role is active',
    example: true,
  })
  @Column('boolean', {
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
