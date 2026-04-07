'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { CalendarEvent } from '@nexus/types';
import MiniCalendar from '@/components/MiniCalendar';

interface EventsDrawerProps {
  events: CalendarEvent[];
  activeEventId: string | null;
  onSelectEvent: (event: CalendarEvent) => void;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function EventsDrawer({ events, activeEventId, onSelectEvent }: EventsDrawerProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    for (const evt of events) {
      if (evt.startTime) {
        dates.add(toDateKey(new Date(evt.startTime)));
      }
    }
    return dates;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!rangeStart) return events;
    const start = rangeStart;
    const end = rangeEnd ?? rangeStart;
    return events.filter((evt) => {
      if (!evt.startTime) return false;
      const key = toDateKey(new Date(evt.startTime));
      return key >= start && key <= end;
    });
  }, [events, rangeStart, rangeEnd]);

  const handleSelectRange = useCallback((start: string, end: string | null) => {
    if (start === rangeStart && end === null && rangeEnd === null) {
      setRangeStart(null);
      setRangeEnd(null);
    } else {
      setRangeStart(start);
      setRangeEnd(end);
    }
  }, [rangeStart, rangeEnd]);

  if (events.length === 0) return null;

  return (
    <div
      className={`absolute top-4 bottom-4 left-0 z-10 w-80 transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-[calc(100%-1.5rem)]'}`}
    >
      <div className={`h-full ml-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 flex flex-col ${drawerOpen ? 'overflow-hidden' : 'overflow-hidden pointer-events-none'}`}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Events ({events.length})
          </h2>
        </div>

        <div className="border-b border-gray-200">
          <MiniCalendar
            eventDates={eventDates}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onSelectRange={handleSelectRange}
          />
        </div>

        {rangeStart && (
          <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(rangeStart + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric' })}
              {rangeEnd && rangeEnd !== rangeStart && (
                <> – {new Date(rangeEnd + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric' })}</>
              )}
              {' · '}{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { setRangeStart(null); setRangeEnd(null); }}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Show all
            </button>
          </div>
        )}

        <div
          ref={listRef}
          className={`flex-1 ${drawerOpen ? 'overflow-y-auto' : 'overflow-y-hidden'}`}
        >
          {filteredEvents.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-gray-400">
              No events{rangeStart ? ' in this range' : ''}
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <button
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                  activeEventId === evt.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm text-gray-900 font-medium">{evt.title}</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {evt.startTime
                    ? new Date(evt.startTime).toLocaleString()
                    : 'No date'}
                </span>
                {evt.location && (
                  <span className="block text-xs text-gray-400 mt-0.5 truncate">
                    {evt.location}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Toggle tab */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 bg-white border border-gray-200 shadow-md rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-500 text-xs">{drawerOpen ? '‹' : '›'}</span>
      </button>
    </div>
  );
}
