import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../category/user/user.entity';
import { PkEntity } from 'src/common/base/pkEntity.base';

@Entity()
export class RefreshToken extends PkEntity {
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
