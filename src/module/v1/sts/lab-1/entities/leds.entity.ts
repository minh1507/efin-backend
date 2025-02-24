import { Column, Entity } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';

@Entity()
export class Leds extends RootEntity {
  @Column('varchar', {
    length: 25,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  status: boolean;
}
