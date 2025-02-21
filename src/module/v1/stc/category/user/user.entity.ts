import { Column, Entity, ManyToOne } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';
import { Role } from '../role/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Entity()
export class User extends RootEntity {
  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ApiProperty({
    description: 'Username',
    example: 'Username',
    maxLength: 25,
  })
  @IsNotEmpty()
  @MaxLength(25)
  @Column('varchar', {
    length: 25,
    nullable: false,
    unique: true,
  })
  username: string;
}
