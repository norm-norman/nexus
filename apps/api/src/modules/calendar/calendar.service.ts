import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as ICAL from 'ical.js';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CalendarService {
    private readonly events: any[] = [];
    constructor(
        private readonly httpService: HttpService) { }

    parseICal(iCalData: string): any {
        return (ICAL as any).parse(iCalData);
    }

    getFeed(id: string): { message: string; status: number } {
        return { message: `Feed ${id} fetched successfully`, status: 200 };
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

        const events = component.getAllSubcomponents('vevent');
        for (const event of events) {
            console.log(event.getFirstPropertyValue('summary'));
            console.log(event.getFirstPropertyValue('location'));
        }

        return {
            data: { calendar_id, calendar_name, calendar_description },
            message: 'Calendar created successfully',
            status: 201
        };
    }

    async getEvents(): Promise<{ data: { events: any[] }, message: string; status: number }> {
        console.log('test');
        const events = [
            {
                id: '1',
                title: 'Event 1',
                start: '2026-01-01',
                geo: { lat: 40.7128, lon: -74.0060 },
            },
            {
                id: '2',
                title: 'Event 2',
                start: '2026-01-02',
                geo: { lat: 40.7129, lon: -74.0061 },
            },
        ]
        return { data: { events: events }, message: 'Events fetched successfully', status: 200 };
    }
}
