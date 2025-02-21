import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

@Entity()
export class Secret extends RootEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'Password',
    example: 'Password',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_PASSWORD })
  @MaxLength(25, { message: MessageEnum.MAX_LENGTH_25 })
  @MinLength(8, { message: MessageEnum.MIN_LENGTH_8 })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,25}$/, {
    message: MessageEnum.INVALID_PASSWORD,
  })
  @Column('varchar', {
    length: 25,
    nullable: false,
    unique: true,
  })
  password: string;
}
