import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
      headers: {
        'User-Agent': 'Nexus/1.0', // Important for Google Calendar
      },
    })],
  controllers: [LocationController],
  providers: [LocationService]
})
export class LocationModule { }
