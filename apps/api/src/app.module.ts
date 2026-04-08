import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { CalendarModule } from './modules/calendar/calendar.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    CalendarModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
