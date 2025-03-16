import { Module, NestModule } from '@nestjs/common';
import { SharedModule } from './module/share/shared.module';
import { V1Module } from './module/v1/v1.module';

@Module({
  imports: [SharedModule, V1Module],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {}
}
