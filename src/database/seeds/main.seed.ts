import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import RoleSeeder from './role.seed';
import SecretSeeder from './secret.seed';
import UserSeeder from './user.seed';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    // await runSeeder(dataSource, EthnicSeeder);
    await runSeeder(dataSource, RoleSeeder);
    await runSeeder(dataSource, SecretSeeder);
    await runSeeder(dataSource, UserSeeder);
  }
}
