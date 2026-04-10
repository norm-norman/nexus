import type { AllCalendarsEventsData } from '@nexus/types';
import type { MobileEvent } from '../types/mobile';

export function toMobileEvents(data: AllCalendarsEventsData): MobileEvent[] {
  return data.flatMap((entry) => {
    const calendarId = Object.keys(entry)[0]!;
    const calendarEvents = entry[calendarId] ?? [];
    if (!Array.isArray(calendarEvents)) return [];

    return calendarEvents.map((event, idx) => ({
      ...event,
      id: `${calendarId}:${event.title ?? 'event'}:${event.start ?? ''}:${idx}`,
    }));
  });
}

export function sortEventsByStart(events: MobileEvent[]): MobileEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}
