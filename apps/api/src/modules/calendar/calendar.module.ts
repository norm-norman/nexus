import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationModule } from '../location/location.module';
import { LocationService } from '../location/location.service';

@Module({
  imports: [
    PrismaModule,
    LocationModule,
    // Configure the global HttpModule
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
      headers: {
        'User-Agent': 'Nexus/1.0', // Important for Google Calendar
      },
    })],
  controllers: [CalendarController],
  providers: [CalendarService, PrismaService, LocationService]
})
export class CalendarModule { }
