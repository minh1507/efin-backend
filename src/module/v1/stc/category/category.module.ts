import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { SecretModule } from './secret/secret.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RoleModule, 
    SecretModule, 
    UserModule,
  ],
  exports: [
    RoleModule,
    SecretModule,
    UserModule,
  ],
})
export class CategoryModule {}
