import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MessageEnum } from '../../../../common/enum/message.enum';
import { BaseEntity } from '../../../../common/base/entity.base';
import { Client } from '../client/client.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
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
    description: 'Resource name',
    example: 'users',
    maxLength: 50,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @IsString()
  @MaxLength(50)
  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  resource!: string;

  @ApiProperty({
    description: 'Action',
    example: 'read',
    enum: ['create', 'read', 'update', 'delete', 'list'],
  })
  @IsNotEmpty()
  @IsString()
  @Column('varchar', {
    length: 20,
    nullable: false,
  })
  action!: string;

  @ApiProperty({
    description: 'Description',
    example: 'Can read user information',
    maxLength: 255,
  })
  @MaxLength(255)
  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  description?: string;
}