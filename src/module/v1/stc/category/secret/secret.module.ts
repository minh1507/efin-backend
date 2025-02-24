import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from './secret.entity';
import { SecretRepository } from './secret.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  providers: [SecretRepository],
  exports: [SecretRepository],
})
export class SecretModule {}
