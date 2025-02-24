import { Column, Entity } from 'typeorm';
import { RootEntity } from '../../../../../common/base/rootEntity.base';

@Entity()
export class Wifi extends RootEntity {
  @Column('boolean', {
    default: false,
    nullable: false,
  })
  status: boolean;
}
