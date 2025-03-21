import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PkEntity } from './pkEntity.base';

export abstract class RootEntity extends PkEntity {
  @CreateDateColumn({ name: 'created_at', nullable: true, select: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, select: false })
  updatedAt?: Date;

  @Column('boolean', { default: true })
  displayIconCreate?: boolean;

  @Column('boolean', { default: true })
  displayIconUpdate?: boolean;

  @Column('boolean', { default: true })
  displayIconDelete?: boolean;

  @Column('boolean', { default: true })
  displayIconDetail?: boolean;
}
