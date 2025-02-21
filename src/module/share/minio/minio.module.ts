import { Module, DynamicModule, Global } from '@nestjs/common';
import * as Minio from 'minio';
import { MinioService } from './minio.service';
import { ConfigService } from '../config/config.service';
import IGlobal from 'src/master/global/global.interface';
import { Agent } from 'https';
@Global()
@Module({})
export class MinioModule {
  static forRoot(): DynamicModule {
    return {
      module: MinioModule,
      providers: [
        {
          provide: 'MINIO_CONNECTION',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const config: IGlobal = await configService.getConfig();

            return new Minio.Client({
              endPoint: String(config['MINIO.END_POINT']),
              port: Number(config['MINIO.PORT']),
              useSSL: true,
              accessKey: String(config['MINIO.ACCESS_KEY']),
              secretKey: String(config['MINIO.SECRET_KEY']),
              transportAgent: new Agent({
                rejectUnauthorized: false,
              }),
            });
          },
        },
        MinioService,
      ],
      exports: ['MINIO_CONNECTION', MinioService],
    };
  }
}
