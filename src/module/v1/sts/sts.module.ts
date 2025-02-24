import { Module } from '@nestjs/common';
import { Lab1Module } from './lab-1/lab1.module';

@Module({
  imports: [Lab1Module],
})
export class STSModule {}
