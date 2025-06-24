import { Column, Entity, OneToOne } from 'typeorm';
import { PkEntity } from '../../../../common/base/pkEntity.base';
import { User } from '../category/user/user.entity';

@Entity()
export class RefreshToken extends PkEntity {
  @Column('varchar', { length: 255 })
  key!: string;

  @Column('timestamp')
  validFrom!: Date;

  @Column('timestamp')
  validTo!: Date;

  @OneToOne(() => User, (user) => user.refreshToken)
  user!: User;
}
