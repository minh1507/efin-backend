import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/base/entity.base';
import { User } from '../category/user/user.entity';

@Entity()
export class Lang extends BaseEntity {
  @OneToMany(() => User, (user) => user.lang)
  users: User[];
}
