import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import WifiSeeder from './wifi.seed';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    // await runSeeder(dataSource, EthnicSeeder);
    // await runSeeder(dataSource, RoleSeeder);
    // await runSeeder(dataSource, SecretSeeder);
    // await runSeeder(dataSource, UserSeeder);
    // await runSeeder(dataSource, LedsSeeder);
    await runSeeder(dataSource, WifiSeeder);
  }
}
