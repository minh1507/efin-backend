import { PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEnum } from '../enum/message.enum';

export abstract class PkEntity {
  @ApiProperty({
    description: 'Id',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_ID })
  @IsString({ message: MessageEnum.INVALID_ID })
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
