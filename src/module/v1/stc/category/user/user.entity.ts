import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';
import { Role } from '../role/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';
import { Secret } from '../secret/secret.entity';

@Entity()
export class User extends RootEntity {
  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ApiProperty({
    description: 'Username',
    example: 'Username',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  @MaxLength(25, { message: MessageEnum.MAX_LENGTH_25 })
  @IsEmail({}, { message: MessageEnum.INVALID_USERNAME })
  @Column('varchar', {
    length: 25,
    nullable: false,
    unique: true,
  })
  username: string;

  @OneToOne(() => Secret)
  @JoinColumn()
  secret: Secret;
}
