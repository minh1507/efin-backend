import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from './secret.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
})
export class SecretModule {}
