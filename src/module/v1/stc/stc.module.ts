import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { LangModule } from './lang/lang.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [CategoryModule, AuthModule, LangModule, RefreshTokenModule],
})
export class STCModule {}
