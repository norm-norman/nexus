import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('health')
  getHealth(): { message: string; status: number } {
    return { message: 'Server is running', status: 200 };
  }
}
