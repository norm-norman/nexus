import type {
  AllCalendarsEventsData,
  CalendarDto,
  CalendarFeedEvent,
  CreateCalendarRequestBody,
  CreateCalendarResponse,
  GetAllCalendarEventsResponse,
  GetCalendarEventsResponse,
  ListCalendarsResponse,
} from '@nexus/types';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as ICAL from 'ical.js';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { LocationService, Location } from '../location/location.service';

interface ParsedEvent {
  title: string;
  start: Date;
  end: Date;
  geo: Location | null;
  description?: string;
}

@Injectable()
export class CalendarService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly locationService: LocationService) { }

  parseICal(iCalData: string): any {
    return (ICAL as any).parse(iCalData);
  }

  async createCalendar(body: CreateCalendarRequestBody): Promise<CreateCalendarResponse> {
    const feedUrl: string = body.url;
    const iCalData = await firstValueFrom(
      this.httpService.get(feedUrl, {
        headers: { 'User-Agent': 'Nexus/1.0' }
      })
    );

    const jCal = this.parseICal(iCalData.data); // calendar data in jCal format
    const component = new (ICAL as any).Component(jCal);
    const calendar_name = component.getFirstPropertyValue('x-wr-calname');
    const calendar_description = component.getFirstPropertyValue('x-wr-caldesc');

    // save to database
    const calendar = await this.prisma.calendar.create({
      data: {
        id: uuidv4(),
        url: feedUrl,
        name: calendar_name,
        description: calendar_description,
      },
    });

    return {
      data: { id: calendar.id },
      message: 'Calendar created successfully',
      status: 201
    };
  }

  async getCalendars(): Promise<ListCalendarsResponse> {
    const calendars = await this.prisma.calendar.findMany();
    return {
      data: calendars as unknown as CalendarDto[],
      message: 'Calendars fetched successfully',
      status: 200
    };
  }

  async getCalendarEvents(calendarId: string): Promise<GetCalendarEventsResponse> {
    const calendar = await this.prisma.calendar.findUnique({
      where: { id: calendarId },
    });
    if (!calendar) {
      return { data: null, message: 'Calendar not found', status: 404 };
    }
    const iCalData = await firstValueFrom(
      this.httpService.get(calendar.url, {
        headers: { 'User-Agent': 'Nexus/1.0' }
      })
    );
    const jCal = this.parseICal(iCalData.data);
    const component = new (ICAL as any).Component(jCal);
    const events = await Promise.all(component.getAllSubcomponents('vevent').map(async event => {
      const location = await this.locationService.getLocation(event.getFirstPropertyValue('location'));
      return {
        title: event.getFirstPropertyValue('summary'),
        start: event.getFirstPropertyValue('dtstart').toJSDate(),
        end: event.getFirstPropertyValue('dtend').toJSDate(),
        geo: location,
        description: event.getFirstPropertyValue('description')
      } as ParsedEvent;
    }));
    // events.sort((a, b) => b.start.getTime() - a.start.getTime());
    return {
      data: events as CalendarFeedEvent[],
      message: 'Events fetched successfully',
      status: 200
    };
  }

  async getAllCalendarEvents(): Promise<GetAllCalendarEventsResponse> {
    const calendars = await this.prisma.calendar.findMany();
    const events: AllCalendarsEventsData = await Promise.all(
      calendars.map((calendar) =>
        this.getCalendarEvents(calendar.id).then((res) => ({
          [calendar.id]: res.data,
        })),
      ),
    );
    return {
      data: events,
      message: 'All calendar events fetched successfully',
      status: 200
    };
  }
}
