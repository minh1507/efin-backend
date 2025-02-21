import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SharedModule } from './module/share/shared.module';
import { V1Module } from './module/v1/v1.module';
import { I18nMiddleware } from './common/middleware/i18n.middleware';

@Module({
  imports: [SharedModule, V1Module],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
