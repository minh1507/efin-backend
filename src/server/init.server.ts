import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from '../app.module';
import { consola } from 'consola';
import { HttpExceptionFilter } from '@/common/filter/http-exception.filter';
import { CustomValidationPipe } from '@/common/pipe/custom.pipe';
import { ConfigService } from '@/module/share/config/config.service';
import IGlobal from '@/master/global/global.interface';
import { LoggerService } from '@/module/share/logger/logger.service';
import { LoggingInterceptor } from '@/common/interceptor/logger.interceptor';
import { TraceIdService } from '@/module/share/trace/trace.service';
import {
  generateMigrations,
  runMigrations,
  runSeed,
} from '@/command/migration.command';




class ServerInitializer {
  private errorCount: number = 0;

  private readonly config: NestApplicationOptions = {
    cors: true,
    logger: ['error', 'warn', 'verbose', 'debug', 'fatal'],
    snapshot: true,
  };

  /**
   * Initialize global pipes
   */
  private async setupPipes(app: INestApplication): Promise<void> {
    try {
      app.useGlobalPipes(new CustomValidationPipe());
      consola.success('✓ Pipes configured successfully');
    } catch (error) {
      consola.error('✗ Failed to configure pipes:', error);
      this.errorCount++;
    }
  }

  /**
   * Setup Swagger documentation
   */
  private async setupSwagger(app: INestApplication, config: IGlobal): Promise<void> {
    if (config['SWAGGER.STATUS'] !== 'ON') {
      consola.info('Swagger is disabled');
      return;
    }

    try {
      const documentBuilder = new DocumentBuilder()
        .setTitle(String(config['SWAGGER.TITLE']))
        .setDescription(String(config['SWAGGER.DESCRIPTION']))
        .setVersion('1.0')
        .addBearerAuth({ in: 'header', type: 'http' }, 'Token')
        .addSecurityRequirements('Token')
        .build();

      const document = SwaggerModule.createDocument(app, documentBuilder);

      SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
          displayOperationId: true,
          persistAuthorization: true,
        },
        customSiteTitle: config['SWAGGER.TITLE'],
        customCss: '.swagger-ui .topbar { display: none; }',
      });

      consola.success('✓ Swagger configured successfully');
    } catch (error) {
      consola.error('✗ Failed to configure Swagger:', error);
      this.errorCount++;
    }
  }

  /**
   * Get application configuration
   */
  private async getAppConfig(app: INestApplication): Promise<IGlobal> {
    return app.get(ConfigService).getConfig();
  }

  /**
   * Setup CORS configuration
   */
  private async setupCors(app: INestApplication): Promise<void> {
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    consola.success('✓ CORS configured successfully');
  }

  /**
   * Display startup logs
   */
  private displayStartupLogs(): void {
    consola.log('\n');
    consola.start('🚀 Booting EFIN Backend Server');
  }

  /**
   * Display completion logs
   */
  private displayCompletionLogs(config: IGlobal): void {
    if (this.errorCount === 0) {
      consola.box(`🎉 Server is running successfully on port ${config['CONFIG.PORT'] || 3100}`);
    } else {
      consola.error(`❌ Server started with ${this.errorCount} configuration errors`);
    }

    const baseUrl = `http://${config['CONFIG.DOMAIN']}:${config['CONFIG.PORT']}`;
    consola.info(`📡 API: ${baseUrl}`);
    consola.info(`📚 Swagger: ${baseUrl}/api`);
    consola.log('');
  }

  /**
   * Start application listener
   */
  private async startListener(app: INestApplication, config: IGlobal): Promise<void> {
    const port = config['CONFIG.PORT'] || 3100;
    await app.listen(port, '0.0.0.0');
    consola.success(`✓ Server listening on port ${port}`);
  }

  /**
   * Run database migrations and seeding
   */
  private async runDatabaseOperations(config: IGlobal): Promise<void> {
    if (config['DATABASE.MIGRATION'] !== 'true') {
      consola.info('Database migrations disabled');
      return;
    }

    try {
      consola.start('Running database migrations...');
      await runMigrations();
      await generateMigrations();

      if (config['DATABASE.SEEDING'] === 'true') {
        consola.start('Running database seeding...');
        await runSeed();
      }

      consola.success('✓ Database operations completed');
    } catch (error) {
      consola.error('✗ Database operations failed:', error);
      this.errorCount++;
    }

    consola.log('');
  }

  /**
   * Setup global filters, guards, and interceptors
   */
  private async setupGlobalFeatures(app: INestApplication): Promise<void> {
    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    const traceIdService = await app.resolve(TraceIdService);
    app.useGlobalInterceptors(new LoggingInterceptor(traceIdService));

    // Note: Global guards can be uncommented when needed
    // const jwtService = app.get(JwtService);
    // const reflector = app.get(Reflector);
    // app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));

    consola.success('✓ Global features configured successfully');
  }

  /**
   * Main server initialization method
   */
  public async run(): Promise<void> {
    try {
      const app = await NestFactory.create(AppModule, this.config);

      // Display initial logs
      this.displayStartupLogs();

      // Get logger service and display big message
      app.get(LoggerService).logBigMessage();

      // Get application configuration
      const config = await this.getAppConfig(app);

      // Setup all application features
      await this.setupGlobalFeatures(app);
      await this.setupCors(app);
      await this.setupPipes(app);
      await this.setupSwagger(app, config);

      // Start the server
      await this.startListener(app, config);

      // Display completion logs
      this.displayCompletionLogs(config);

      // Run database operations
      await this.runDatabaseOperations(config);

    } catch (error) {
      consola.fatal('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default ServerInitializer;
