import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as ICAL from 'ical.js';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CalendarService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService) { }

  parseICal(iCalData: string): any {
    return (ICAL as any).parse(iCalData);
  }

  async createCalendar(body: any): Promise<{ data: any, message: string; status: number }> {
    const feedUrl: string = body.url;
    const iCalData = await firstValueFrom(
      this.httpService.get(feedUrl, {
        headers: { 'User-Agent': 'Nexus/1.0' }
      })
    );

    const jCal = this.parseICal(iCalData.data); // calendar data in jCal format
    const component = new (ICAL as any).Component(jCal);
    const calendar_id = component.getFirstPropertyValue('prodid');
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
}
