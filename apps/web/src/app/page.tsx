'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { selectFocusEvent } from '@nexus/location-utils';
import type { CalendarEvent, CalendarSource } from '@nexus/types';
import { fetchIcalEvents, calendarNameFromUrl, mergeEvents } from '@/lib/ical';
import { loadSavedCalendars, saveCalendars } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import CalendarsDrawer from '@/components/CalendarsDrawer';
import EventsDrawer from '@/components/EventsDrawer';
import LocationDrawer from '@/components/LocationDrawer';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function Home() {
  const [calendars, setCalendars] = useState<CalendarSource[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = loadSavedCalendars();
    if (saved.length === 0) return;

    Promise.allSettled(
      saved.map(async ({ url, name }) => {
        const calId = crypto.randomUUID();
        const { name: icalName, events: fetched } = await fetchIcalEvents(url, calId);
        const source: CalendarSource = {
          id: calId,
          url,
          name: icalName || name,
          eventCount: fetched.length,
          visible: true,
        };
        return { source, events: fetched };
      })
    ).then((results) => {
      const sources: CalendarSource[] = [];
      let events: CalendarEvent[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') {
          sources.push(r.value.source);
          events = mergeEvents(events, r.value.events);
        }
      }
      if (sources.length > 0) {
        setCalendars(sources);
        setAllEvents(events);
      }
    });
  }, []);

  useEffect(() => {
    if (calendars.length === 0 && !restoredRef.current) return;
    saveCalendars(calendars.map((c) => ({ url: c.url, name: c.name })));
  }, [calendars]);

  const visibleCalendarIds = useMemo(
    () => new Set(calendars.filter((c) => c.visible).map((c) => c.id)),
    [calendars]
  );

  const events = useMemo(
    () => allEvents.filter((e) => visibleCalendarIds.has(e.calendarId)),
    [allEvents, visibleCalendarIds]
  );

  const focusEvent = useMemo(() => {
    return selectFocusEvent(events, {
      getLat: (event) => event.lat,
      getLon: (event) => event.lon,
      getStartTime: (event) => event.startTime,
    });
  }, [events]);

  const handleAddCalendar = async (url: string) => {
    if (calendars.some((c) => c.url === url)) {
      throw new Error('This calendar is already added');
    }

    const calId = crypto.randomUUID();
    const { name: icalName, events: fetched } = await fetchIcalEvents(url, calId);

    const source: CalendarSource = {
      id: calId,
      url,
      name: icalName || calendarNameFromUrl(url),
      eventCount: fetched.length,
      visible: true,
    };

    setCalendars((prev) => [...prev, source]);
    setAllEvents((prev) => mergeEvents(prev, fetched));
  };

  const toggleCalendarVisibility = (id: string) => {
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const refreshCalendar = async (id: string) => {
    const cal = calendars.find((c) => c.id === id);
    if (!cal) return;

    try {
      const { name: icalName, events: fetched } = await fetchIcalEvents(cal.url, id);

      setCalendars((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name: icalName || c.name, eventCount: fetched.length } : c
        )
      );
      setAllEvents((prev) => mergeEvents(prev, fetched, id));
      if (detailEvent?.calendarId === id) setDetailEvent(null);
    } catch {
      // refresh is best-effort
    }
  };

  const removeCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
    setAllEvents((prev) => prev.filter((e) => e.calendarId !== id));
    if (detailEvent?.calendarId === id) setDetailEvent(null);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <SearchBar onSubmit={handleAddCalendar} />

      <CalendarsDrawer
        calendars={calendars}
        onToggleVisibility={toggleCalendarVisibility}
        onRefresh={refreshCalendar}
        onRemove={removeCalendar}
      />

      <EventsDrawer
        events={events}
        activeEventId={detailEvent?.id ?? null}
        onSelectEvent={setDetailEvent}
      />

      <MapView
        events={events}
        activeEvent={detailEvent}
        onMarkerClick={setDetailEvent}
        focusEvent={focusEvent}
      />

      {detailEvent && (
        <LocationDrawer event={detailEvent} onClose={() => setDetailEvent(null)} />
      )}
    </div>
  );
}
