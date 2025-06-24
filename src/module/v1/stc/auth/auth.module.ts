import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../category/user/user.module';
import { SecretModule } from '../category/secret/secret.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { ClientModule } from '../client/client.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { CachingModule } from '../../../share/cache/cache.module';
import { Client } from '../client/client.entity';
import { Secret } from '../category/secret/secret.entity';
import { RolePermission } from '../role-permission/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Secret, RolePermission]),
    UserModule,
    SecretModule,
    RefreshTokenModule,
    ClientModule,
    RolePermissionModule,
    CachingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
