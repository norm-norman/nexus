import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  lat: number | null;
  lon: number | null;
}

const events: Event[] = [];

export async function GET() {
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = await request.json();
  const event: Event = {
    id: randomUUID(),
    title: body.title,
    startTime: body.startTime,
    endTime: body.endTime,
    lat: body.lat ?? null,
    lon: body.lon ?? null,
  };
  events.push(event);
  return NextResponse.json(event, { status: 201 });
}
