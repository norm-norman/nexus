import { NextResponse } from 'next/server';
import ICAL from 'ical.js';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

async function geocode(query: string): Promise<{ lat: number; lon: number } | null> {
  if (!MAPBOX_TOKEN || !query) return null;

  try {
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&limit=1&access_token=${MAPBOX_TOKEN}`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (coords && coords.length >= 2) {
      return { lat: coords[1], lon: coords[0] };
    }
  } catch {
    // geocoding is best-effort
  }

  return null;
}

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch iCal: ${res.status}` },
        { status: 502 }
      );
    }

    const icalText = await res.text();
    const parsed = ICAL.parse(icalText);
    const comp = new ICAL.Component(parsed);
    const vevents = comp.getAllSubcomponents('vevent');

    const rawEvents = vevents.map((vevent: ICAL.Component) => {
      const event = new ICAL.Event(vevent);
      const geo = vevent.getFirstProperty('geo');
      let lat: number | null = null;
      let lon: number | null = null;

      if (geo) {
        const val = geo.getFirstValue();
        if (Array.isArray(val) && val.length >= 2) {
          lat = parseFloat(val[0]);
          lon = parseFloat(val[1]);
        }
      }

      return {
        id: event.uid || crypto.randomUUID(),
        title: event.summary || '(untitled)',
        location: event.location || null,
        startTime: event.startDate?.toJSDate().toISOString() ?? null,
        endTime: event.endDate?.toJSDate().toISOString() ?? null,
        lat,
        lon,
      };
    });

    const events = await Promise.all(
      rawEvents.map(async (evt) => {
        if (evt.lat !== null && evt.lon !== null) return evt;
        if (!evt.location) return evt;

        const coords = await geocode(evt.location);
        if (coords) {
          return { ...evt, lat: coords.lat, lon: coords.lon };
        }
        return evt;
      })
    );

    const calName =
      comp.getFirstPropertyValue('x-wr-calname') ??
      comp.getFirstPropertyValue('name') ??
      null;

    return NextResponse.json({ name: calName, events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Parse error';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
