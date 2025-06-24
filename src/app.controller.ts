import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './module/v1/decorator/guard.decorator';

@Controller()
@ApiTags('Health')
export class AppController {
  @Get('health')
  @Public()
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'efin-backend'
    };
  }

  @Get()
  @Public()
  getInfo() {
    return {
      message: 'EFIN Backend API is running',
      timestamp: new Date().toISOString()
    };
  }
} 