import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleMenu } from './role-menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleMenu])],
  exports: [TypeOrmModule],
})
export class RoleMenuModule {} 