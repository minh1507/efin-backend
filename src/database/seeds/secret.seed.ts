import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Secret } from '../../module/v1/stc/category/secret/secret.entity';

export default class SecretSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Secret);

    await repository.delete({});

    await repository.save([SECRET_ADMIN]);
  }
}

export const SECRET_ADMIN = {
  password: '$2a$12$lwsseM8VJ7EnP1lxFO4qq.P6GGvasXCNfBn.AQhTEFiYrhRDqTtje', // Minlvip123!
} as Secret;
