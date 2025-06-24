import { Module } from '@nestjs/common';
import { STSModule } from './sts/sts.module';
import { STCModule } from './stc/stc.module';
import { SharedAuthModule } from './stc/shared-auth.module';

@Module({
  imports: [SharedAuthModule, STSModule, STCModule],
})
export class V1Module {}
