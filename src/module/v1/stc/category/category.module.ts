import { Module } from '@nestjs/common';
import { EthnicModule } from './ethnic/ethnic.module';
import { RoleModule } from './role/role.module';
import { SecretModule } from './secret/secret.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [EthnicModule, RoleModule, SecretModule, UserModule],
})
export class CategoryModule {}
