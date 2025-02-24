import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column } from 'typeorm';
import { RootEntity } from './rootEntity.base';
import { MessageEnum } from '../enum/message.enum';

export abstract class BaseEntity extends RootEntity {
  @ApiProperty({
    description: 'Code',
    example: '124',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_CODE })
  @MaxLength(25, { message: MessageEnum.MAX_LENGTH_25 })
  @Column('varchar', {
    length: 25,
    nullable: false,
    unique: true,
  })
  code: string;

  @ApiProperty({
    description: 'Name',
    example: 'Shoe',
    maxLength: 100,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_NAME })
  @MaxLength(100, { message: MessageEnum.MAX_LENGTH_100 })
  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name: string;
}
