import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../../module/v1/stc/category/role/role.entity';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Role);

    await repository.delete({});

    await repository.save([ROLE_ADMIN, ROLE_USER]);
  }
}

export const ROLE_ADMIN = {
  code: 'ADMIN',
  name: 'Admin',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Role;
export const ROLE_USER = {
  code: 'User',
  name: 'User',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Role;
