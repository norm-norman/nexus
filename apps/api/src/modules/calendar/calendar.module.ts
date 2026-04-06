import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [    // Configure the global HttpModule
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
      headers: {
        'User-Agent': 'Nexus/1.0', // Important for Google Calendar
      },
    })],
  controllers: [CalendarController],
  providers: [CalendarService]
})
export class CalendarModule { }
