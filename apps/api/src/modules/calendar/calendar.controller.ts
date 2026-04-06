import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get('/:id')
    getFeed(@Param('id') id: string): { message: string; status: number } {
        return this.calendarService.getFeed(id);
    }

    @Post('/')
    async create(@Body() body: any): Promise<{ data: any, message: string; status: number }> {
        return await this.calendarService.createCalendar(body);
    }

    @Get('/events')
    async getEvents(): Promise<{ data: { events: any[] }, message: string; status: number }> {
        const data = await this.calendarService.getEvents();
        console.log(data);
        return data;
    }
}
