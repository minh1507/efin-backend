import { Column, Entity } from 'typeorm';
import { RootEntity } from 'src/common/base/rootEntity.base';

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
}
