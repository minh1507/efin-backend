import { DataSource } from 'typeorm';
import { Seeder, runSeeder } from 'typeorm-extension';
import EthnicSeeder from './ethnic.seed';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeder(dataSource, EthnicSeeder);
  }
}
