import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Leds } from '../../module/v1/sts/lab-1/entities/leds.entity';

export default class LedsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Leds);

    await repository.delete({});

    await repository.save([LED_1, LED_2, LED_3, LED_4]);
  }
}

export const LED_1 = {
  name: 'Led 1',
  status: false,
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Leds;
export const LED_2 = {
  name: 'Led 2',
  status: false,
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Leds;
export const LED_3 = {
  name: 'Led 3',
  status: false,
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Leds;
export const LED_4 = {
  name: 'Led 4',
  status: false,
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Leds;
