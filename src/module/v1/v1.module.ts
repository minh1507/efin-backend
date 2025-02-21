import { Module } from '@nestjs/common';
import { STSModule } from './sts/sts.module';
import { STCModule } from './stc/stc.module';

@Module({
  imports: [STSModule, STCModule],
})
export class V1Module {}
