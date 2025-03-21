import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';
import { PkEntity } from 'src/common/base/pkEntity.base';

@Entity()
export class Secret extends PkEntity {
  @ApiProperty({
    description: 'Password',
    example: 'Password',
    minLength: 8,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_PASSWORD })
  @MinLength(8, { message: MessageEnum.MIN_LENGTH_8 })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,25}$/, {
    message: MessageEnum.INVALID_PASSWORD,
  })
  @Column('text', {
    nullable: false,
    unique: true,
  })
  password: string;
}
