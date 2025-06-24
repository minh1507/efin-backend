import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from '../../../../common/base/entity.base';
import { Client } from '../client/client.entity';

@Entity('menus')
export class Menu extends BaseEntity {
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
    description: 'Menu name',
    example: 'User Management',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name!: string;

  @ApiProperty({
    description: 'Menu path/URL',
    example: '/users',
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @Column('varchar', {
    length: 200,
    nullable: false,
  })
  path!: string;

  @ApiProperty({
    description: 'Menu icon',
    example: 'users',
    maxLength: 50,
  })
  @MaxLength(50)
  @Column('varchar', {
    length: 50,
    nullable: true,
  })
  icon?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 1,
  })
  @IsNumber()
  @Column('int', {
    default: 0,
  })
  sortOrder!: number;

  @ApiProperty({
    description: 'Menu is visible',
    example: true,
  })
  @IsBoolean()
  @Column('boolean', {
    default: true,
  })
  isVisible!: boolean;
} 