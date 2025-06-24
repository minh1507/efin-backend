export interface DatabaseConfig {
  host: string;
  name: string;
  password: string;
  port: string;
  user: string;
  migration: string;
  seeding: string;
}

export interface SwaggerConfig {
  description: string;
  password: string;
  status: 'ON' | 'OFF';
  title: string;
  user: string;
}

export interface MinioConfig {
  accessKey: string;
  bucket: string;
  endPoint: string;
  port: string;
  secretKey: string;
}

export interface TokenConfig {
  secretKey: string;
  accessKeyExpired: string;
  refreshKeyExpired: string;
}

export interface RedisConfig {
  host: string;
  port: string;
}

export interface AppConfig {
  domain: string;
  port: string;
}

export interface GlobalConfig {
  config: AppConfig;
  database: DatabaseConfig;
  swagger: SwaggerConfig;
  minio: MinioConfig;
  token: TokenConfig;
  redis: RedisConfig;
} 