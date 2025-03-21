import { Entity, OneToMany } from 'typeorm';
import { User } from '../category/user/user.entity';
import { BaseEntity } from 'src/common/base/entity.base';

@Entity()
export class Lang extends BaseEntity {
  @OneToMany(() => User, (user) => user.lang)
  users: User[];
}
