import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../module/v1/stc/category/user/user.entity';
import { ROLE_ADMIN } from './role.seed';
import { SECRET_ADMIN } from './secret.seed';
import { LANG_VI } from './lang.seed';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);

    await repository.delete({});

    await repository.save([USER_ADMIN]);
  }
}

export const USER_ADMIN = {
  username: 'duongdoican@gmail.com',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
  role: ROLE_ADMIN,
  secret: SECRET_ADMIN,
  lang: LANG_VI
} as User;
