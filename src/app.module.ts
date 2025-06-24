import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from './module/share/shared.module';
import { V1Module } from './module/v1/v1.module';
import { AppController } from './app.controller';

@Module({
  imports: [SharedModule, V1Module],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {}
}
