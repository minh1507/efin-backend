import NodeVault from 'node-vault';
import { join } from 'path';
import IGlobal from 'src/master/global/global.interface';
import { ConfigService } from 'src/module/share/config/config.service';
import { VaultService } from 'src/module/share/vault/vault.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import MainSeeder from '../database/seeds/main.seed';

config();

const MIGRATION = join(
  __dirname,
  '..',
  'database',
  'migrations',
  `/**/*{.ts,.js}`,
);
const V1 = join(__dirname, '..', 'module', 'v1', `/**/*.entity{.ts,.js}`);

export async function getPostgresOptions(
  configService: ConfigService,
): Promise<DataSourceOptions & SeederOptions> {
  const dbConfig: IGlobal = await configService.getConfig();

  return {
    type: 'postgres',
    host: dbConfig['DATABASE.HOST'],
    port: Number(dbConfig['DATABASE.PORT']),
    username: dbConfig['DATABASE.USER'],
    password: dbConfig['DATABASE.PASSWORD'],
    database: dbConfig['DATABASE.NAME'],
    entities: [V1],
    synchronize: false,
    logging: ['error'],
    seeds: [MainSeeder],
    migrations: [MIGRATION],
    logger: 'debug',
  };
}

export async function createDataSource(
  configService: ConfigService,
): Promise<DataSource> {
  const postgresOptions = await getPostgresOptions(configService);
  return new DataSource({
    ...postgresOptions,
  });
}

async function initializeDataSource() {
  const vault = new VaultService(
    NodeVault({
      endpoint: process.env['MAIN.DOMAIN'],
      token: process.env['MAIN.SECRET'],
    }),
  );

  const configService = new ConfigService(vault);

  const postgresOptions = await getPostgresOptions(configService);

  return new DataSource(postgresOptions);
}

export const AppDataSource = initializeDataSource();
