import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lang } from './lang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lang])],
})
export class LangModule {}
