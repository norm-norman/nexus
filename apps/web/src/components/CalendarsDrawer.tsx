'use client';

import { useState } from 'react';
import type { CalendarSource } from '@nexus/types';

interface CalendarsDrawerProps {
  calendars: CalendarSource[];
  onToggleVisibility: (id: string) => void;
  onRefresh: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CalendarsDrawer({ calendars, onToggleVisibility, onRefresh, onRemove }: CalendarsDrawerProps) {
  const [open, setOpen] = useState(true);

  if (calendars.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-10 w-64">
      <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-xs font-semibold text-gray-900">
            Calendars ({calendars.length})
          </span>
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className="border-t border-gray-200">
            {calendars.map((cal) => (
              <div
                key={cal.id}
                className="px-4 py-2 flex items-center gap-2 border-b border-gray-100 last:border-0"
              >
                <input
                  type="checkbox"
                  checked={cal.visible}
                  onChange={() => onToggleVisibility(cal.id)}
                  className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{cal.name}</p>
                  <p className="text-[10px] text-gray-400">{cal.eventCount} events</p>
                </div>
                <button
                  onClick={() => onRefresh(cal.id)}
                  title="Refresh"
                  className="shrink-0 text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1v5h5M15 15v-5h-5" />
                    <path d="M2.5 10A6 6 0 0113.3 3.3L15 5M13.5 6A6 6 0 012.7 12.7L1 11" />
                  </svg>
                </button>
                <button
                  onClick={() => onRemove(cal.id)}
                  title="Remove"
                  className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
