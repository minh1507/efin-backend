import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PkEntity } from '../../../../common/base/pkEntity.base';
import { Role } from '../category/role/role.entity';
import { Permission } from '../permission/permission.entity';

@Entity('role_permissions')
export class RolePermission extends PkEntity {
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column('uuid')
  roleId!: string;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permissionId' })
  permission!: Permission;

  @Column('uuid')
  permissionId!: string;
} 