import { join } from 'path';
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

export function getPostgresOptions(): DataSourceOptions & SeederOptions {
  // Check if running in Docker (có biến môi trường MAIN.DOMAIN)
  const isDocker = process.env['MAIN.DOMAIN']?.includes('vault:8200');
  
  return {
    type: 'postgres',
    host: isDocker ? 'postgres' : (process.env.DATABASE_HOST || 'localhost'),
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: isDocker ? '123456' : (process.env.DATABASE_PASSWORD || 'password'),
    database: isDocker ? 'efin_db' : (process.env.DATABASE_NAME || 'efin'),
    entities: [V1],
    synchronize: true,
    logging: ['error'],
    seeds: [MainSeeder],
    migrations: [MIGRATION],
    logger: 'debug',
  };
}

export function createDataSource(): DataSource {
  const postgresOptions = getPostgresOptions();
  return new DataSource(postgresOptions);
}

export const AppDataSource = createDataSource();
