import type {
  CreateCalendarRequestBody,
  CreateCalendarResponse,
  GetAllCalendarEventsResponse,
  GetCalendarEventsResponse,
  ListCalendarsResponse,
} from '@nexus/types';
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @Post('/')
  async create(@Body() body: CreateCalendarRequestBody): Promise<CreateCalendarResponse> {
    return await this.calendarService.createCalendar(body);
  }

  @Get('/')
  async getCalendars(): Promise<ListCalendarsResponse> {
    return await this.calendarService.getCalendars();
  }

  @Get('/:calendarId/events')
  async getCalendarEvents(@Param('calendarId') calendarId: string): Promise<GetCalendarEventsResponse> {
    return await this.calendarService.getCalendarEvents(calendarId);
  }

  @Get('/events')
  async getAllCalendarEvents(): Promise<GetAllCalendarEventsResponse> {
    return await this.calendarService.getAllCalendarEvents();
  }
}
