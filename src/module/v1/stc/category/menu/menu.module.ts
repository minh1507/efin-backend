import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenuRepository } from './menu.repository';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { ResponseClient } from 'src/common/response/success.response';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuRepository, MenuService, ResponseClient],
  exports: [MenuService],
})
export class MenuModule {}
