import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './modules/calendar/calendar.module';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [
    CalendarModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
