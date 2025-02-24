import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Wifi } from '../../module/v1/sts/lab-1/entities/wifi.entity';

export default class WifiSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Wifi);

    await repository.delete({});

    await repository.save([WIFI_1]);
  }
}

export const WIFI_1 = {
  status: false,
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Wifi;
