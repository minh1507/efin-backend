import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ClientModule } from './client/client.module';
import { PermissionModule } from './permission/permission.module';
import { MenuModule } from './menu/menu.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { RoleMenuModule } from './role-menu/role-menu.module';

@Module({
  imports: [
    CategoryModule, 
    AuthModule, 
    RefreshTokenModule,
    ClientModule,
    PermissionModule,
    MenuModule,
    RolePermissionModule,
    RoleMenuModule,
  ],
  exports: [
    CategoryModule,
    AuthModule,
    RefreshTokenModule,
    ClientModule,
    PermissionModule,
    MenuModule,
    RolePermissionModule,
    RoleMenuModule,
  ],
})
export class STCModule {}
