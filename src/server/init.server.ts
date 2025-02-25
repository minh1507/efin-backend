import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from '../app.module';
import { consola } from 'consola';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { CustomValidationPipe } from 'src/common/pipe/custom.pipe';
import { ConfigService } from 'src/module/share/config/config.service';
import IGlobal from 'src/master/global/global.interface';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { LoggingInterceptor } from 'src/common/interceptor/logger.interceptor';
import { TraceIdService } from 'src/module/share/trace/trace.service';
import {
  generateMigrations,
  runMigrations,
} from 'src/command/migration.command';
import { JwtAuthGuard } from '../module/v1/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

class Main {
  private flag: number = 0;

  private config: NestApplicationOptions = {
    cors: true,
    logger: ['error', 'warn', 'verbose', 'debug', 'fatal'],
    snapshot: true,
  };

  private pipe = async (app: INestApplication): Promise<void> => {
    try {
      app.useGlobalPipes(new CustomValidationPipe());
      consola.success(' Pipe');
    } catch (error) {
      consola.log(error);
      consola.fail(' Pipe');
      this.flag++;
    }
  };

  private swagger = async (
    app: INestApplication,
    init: IGlobal,
  ): Promise<void> => {
    if (init['SWAGGER.STATUS'] == 'ON') {
      try {
        // app.use(
        //   ['/api'],
        //   basicAuth({
        //     challenge: true,
        //     users: {
        //       [init['SWAGGER.USER']]: init['SWAGGER.PASSWORD'],
        //     },
        //   }),
        // );

        const document = SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
            .setTitle(String(init['SWAGGER.TITLE']))
            .setDescription(String(init['SWAGGER.DESCRIPTION']))
            .setVersion('')
            .addBearerAuth({ in: 'header', type: 'http' }, 'Token')
            .addSecurityRequirements('Token')
            .build(),
        );

        SwaggerModule.setup('api', app, document, {
          swaggerOptions: {
            displayOperationId: true,
            persistAuthorization: true,
          },
          customSiteTitle: init['SWAGGER.TITLE'],
          customCss: '.swagger-ui .topbar {display: none; }',
        });

        consola.success(' Swagger');
      } catch (error) {
        consola.log(error);
        consola.fail(' Swagger');
        this.flag++;
      }
    }
  };

  private onInit = async (app: INestApplication): Promise<IGlobal> => {
    return app.get(ConfigService).getConfig();
  };

  private cors = async (app: INestApplication) => {
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
  };

  private startLog = async () => {
    consola.log('\n');
    consola.start(' Booting server');
  };

  private endLog = async (init: IGlobal) => {
    if (!this.flag) {
      consola.box(`Server is running on port ${init['CONFIG.PORT'] || 3100}`);
    } else {
      consola.error(' Config server failed');
    }

    consola.info(
      'Api: http://' + init['CONFIG.DOMAIN'] + ':' + init['CONFIG.PORT'],
    );
    consola.info(
      'Swagger: http://' +
        init['CONFIG.DOMAIN'] +
        ':' +
        init['CONFIG.PORT'] +
        '/api',
    );

    consola.log('');
  };

  private listener = async (app: INestApplication, init: IGlobal) => {
    await app.listen(init['CONFIG.PORT'] || 3100, '0.0.0.0');
  };

  private migration = async (init: IGlobal) => {
    if (init['DATABASE.MIGRATION'] == 'true') {
      await runMigrations();

      await generateMigrations();

      consola.log('');
    }
  };

  run = async (): Promise<void> => {
    const app = await NestFactory.create(AppModule, this.config);

    const traceIdService = await app.resolve(TraceIdService);

    app.useGlobalInterceptors(new LoggingInterceptor(traceIdService));

    // console.clear();

    app.get(LoggerService).logBigMessage();

    const init = await this.onInit(app);

    app.useGlobalFilters(new HttpExceptionFilter());

    const jwtService = app.get(JwtService);
    const reflector = app.get(Reflector);

    // app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));

    await this.cors(app);

    await this.startLog();

    await this.pipe(app);

    await this.swagger(app, init);

    await this.listener(app, init);

    await this.endLog(init);

    await this.migration(init);
  };
}

export default Main;
