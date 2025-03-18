import { Column, Entity, OneToOne } from 'typeorm';
import { RootEntity } from 'src/common/base/rootEntity.base';
import { User } from '../category/user/user.entity';

@Entity()
export class RefreshToken extends RootEntity {
  @Column('varchar', {
    nullable: false,
    length: 100
  })
  key: string;

  @Column('date', {
    nullable: false,
  })
  validFrom: Date;

  @Column('date', {
    nullable: false,
  })
  validTo: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  user: User;
}
