import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PkEntity } from '../../../../common/base/pkEntity.base';
import { Role } from '../category/role/role.entity';
import { Menu } from '../menu/menu.entity';

@Entity('role_menus')
export class RoleMenu extends PkEntity {
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column('uuid')
  roleId!: string;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu!: Menu;

  @Column('uuid')
  menuId!: string;
} 