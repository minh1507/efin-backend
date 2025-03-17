import { Lang } from 'src/module/v1/stc/lang/lang.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class LangSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Lang);

    await repository.delete({});

    await repository.save([LANG_VI, LANG_EN]);
  }
}

export const LANG_VI = {
  code: 'VI',
  name: 'vi',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Lang;
export const LANG_EN = {
  code: 'EN',
  name: 'en',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Lang;
