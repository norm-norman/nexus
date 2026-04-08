import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @Post('/')
  async create(@Body() body: any): Promise<{ data: any, message: string; status: number }> {
    return await this.calendarService.createCalendar(body);
  }

  @Get('/')
  async getCalendars(): Promise<{ data: any, message: string; status: number }> {
    return await this.calendarService.getCalendars();
  }

  @Get('/:calendarId/events')
  async getCalendarEvents(@Param('calendarId') calendarId: string): Promise<{ data: any, message: string; status: number }> {
    return await this.calendarService.getCalendarEvents(calendarId);
  }

  @Get('/events')
  async getAllCalendarEvents(): Promise<{ data: any, message: string; status: number }> {
    return await this.calendarService.getAllCalendarEvents();
  }
}
