import type { GetHealthResponse } from '@nexus/types';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('health')
  getHealth(): GetHealthResponse {
    return { message: 'Server is running', status: 200 };
  }
}
