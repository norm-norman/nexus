import type { CalendarEvent } from '@nexus/types';

export interface IcalFetchResult {
  name: string | null;
  events: CalendarEvent[];
}

export async function fetchIcalEvents(url: string, calendarId: string): Promise<IcalFetchResult> {
  const res = await fetch('/api/events/ical', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to load calendar');
  }

  const { name, events } = await res.json() as { name: string | null; events: CalendarEvent[] };
  const tagged = events
    .map((evt) => ({ ...evt, calendarId }))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return { name, events: tagged };
}

export function calendarNameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const filename = u.pathname.split('/').pop()?.replace(/\.ics$/i, '');
    if (filename && filename.length > 1) return filename;
    return u.hostname;
  } catch {
    return url.slice(0, 30);
  }
}

export function mergeEvents(existing: CalendarEvent[], incoming: CalendarEvent[], replaceCalendarId?: string): CalendarEvent[] {
  const base = replaceCalendarId
    ? existing.filter((e) => e.calendarId !== replaceCalendarId)
    : existing;
  return [...base, ...incoming].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}
