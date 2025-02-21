import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEnum } from '../enum/message.enum';

export abstract class RootEntity {
  @ApiProperty({
    description: 'Id',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_ID })
  @IsString({ message: MessageEnum.INVALID_ID })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', nullable: true, select: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, select: false })
  updatedAt?: Date;
}
