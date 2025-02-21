import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/entity.base';
import { User } from '../user/user.entity';

@Entity()
export class Role extends BaseEntity {
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
