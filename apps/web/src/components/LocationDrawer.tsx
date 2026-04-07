'use client';

import type { CalendarEvent } from '@nexus/types';

interface LocationDrawerProps {
  event: CalendarEvent;
  onClose: () => void;
}

function formatDuration(start: string, end: string | null): string | null {
  if (!end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms <= 0) return null;
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (remMins === 0) return `${hrs}hr`;
  return `${hrs}hr ${remMins}min`;
}

function formatTimeRange(start: string, end: string | null): string {
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  if (!end) return s.toLocaleTimeString('default', opts);
  const e = new Date(end);
  return `${s.toLocaleTimeString('default', opts)} – ${e.toLocaleTimeString('default', opts)}`;
}

export default function LocationDrawer({ event, onClose }: LocationDrawerProps) {
  const dateStr = new Date(event.startTime).toLocaleDateString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeRange = formatTimeRange(event.startTime, event.endTime);
  const duration = formatDuration(event.startTime, event.endTime);

  const directionsUrl =
    event.lat != null && event.lon != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lon}`
      : event.location
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`
        : null;

  const mapsUrl =
    event.lat != null && event.lon != null
      ? `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lon}`
      : event.location
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
        : null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg mx-4 mb-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight truncate">
              {event.title}
            </h2>
            {event.location && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{event.location}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        {/* Info rows */}
        <div className="px-5 pb-4 space-y-2.5">
          {/* Date & time */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-5 h-5 mt-0.5 text-gray-400">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-900">{dateStr}</p>
              <p className="text-xs text-gray-500">{timeRange}{duration && ` (${duration})`}</p>
            </div>
          </div>

          {/* Location / address */}
          {event.location && (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-5 h-5 mt-0.5 text-gray-400">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145 28.315 28.315 0 003.182-2.087C15.794 15.034 18 12.22 18 8.5a8 8 0 00-16 0c0 3.72 2.206 6.534 4.203 8.19a28.299 28.299 0 003.463 2.232l.018.01.006.002zM10 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-900">{event.location}</p>
                {event.lat != null && event.lon != null && (
                  <p className="text-xs text-gray-400">{event.lat.toFixed(5)}, {event.lon.toFixed(5)}</p>
                )}
              </div>
            </div>
          )}

          {/* Coordinates only (no location text) */}
          {!event.location && event.lat != null && event.lon != null && (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-5 h-5 mt-0.5 text-gray-400">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145 28.315 28.315 0 003.182-2.087C15.794 15.034 18 12.22 18 8.5a8 8 0 00-16 0c0 3.72 2.206 6.534 4.203 8.19a28.299 28.299 0 003.463 2.232l.018.01.006.002zM10 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-900">{event.lat.toFixed(5)}, {event.lon.toFixed(5)}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-4 flex gap-2">
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
              </svg>
              Directions
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.388l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
              </svg>
              View in Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
