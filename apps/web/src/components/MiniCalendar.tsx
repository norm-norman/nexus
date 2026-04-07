'use client';

import { useMemo, useState } from 'react';

interface MiniCalendarProps {
  eventDates: Set<string>;
  rangeStart: string | null;
  rangeEnd: string | null;
  onSelectRange: (start: string, end: string | null) => void;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function MiniCalendar({ eventDates, rangeStart, rangeEnd, onSelectRange }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    if (rangeStart) return new Date(rangeStart + 'T00:00:00');
    return new Date();
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; currentMonth: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), currentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), currentMonth: true });
    }
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push({ date: new Date(year, month + 1, d), currentMonth: false });
      }
    }

    const result: { date: Date; currentMonth: boolean }[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [year, month]);

  const todayKey = toDateKey(new Date());

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleClick = (key: string) => {
    if (!rangeStart || rangeEnd) {
      onSelectRange(key, null);
    } else if (key === rangeStart) {
      onSelectRange(key, null);
    } else {
      const [a, b] = key < rangeStart ? [key, rangeStart] : [rangeStart, key];
      onSelectRange(a, b);
    }
  };

  function isInRange(key: string): boolean {
    if (!rangeStart) return false;
    if (!rangeEnd) return key === rangeStart;
    return key >= rangeStart && key <= rangeEnd;
  }

  function isRangeEdge(key: string): boolean {
    return key === rangeStart || key === rangeEnd;
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-xs">
          ‹
        </button>
        <span className="text-xs font-semibold text-gray-900">{monthLabel}</span>
        <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-xs">
          ›
        </button>
      </div>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {DAY_LABELS.map((d) => (
              <th key={d} className="text-[10px] font-medium text-gray-400 py-1 text-center">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map(({ date, currentMonth }, di) => {
                const key = toDateKey(date);
                const isToday = key === todayKey;
                const inRange = isInRange(key);
                const isEdge = isRangeEdge(key);
                const hasEvents = eventDates.has(key);
                const isFirstInRow = di === 0;
                const isLastInRow = di === 6;

                return (
                  <td
                    key={key}
                    className={`text-center p-0 ${
                      inRange && !isEdge ? 'bg-blue-100' : ''
                    } ${
                      inRange && isEdge && key === rangeStart && rangeEnd ? (isLastInRow ? '' : 'bg-linear-to-l from-blue-100 to-transparent') : ''
                    } ${
                      inRange && isEdge && key === rangeEnd ? (isFirstInRow ? '' : 'bg-linear-to-r from-blue-100 to-transparent') : ''
                    } ${
                      inRange && !isEdge && isFirstInRow ? 'rounded-l' : ''
                    } ${
                      inRange && !isEdge && isLastInRow ? 'rounded-r' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleClick(key)}
                      className={`relative w-7 h-7 text-[11px] rounded-full transition-colors
                        ${!currentMonth ? 'text-gray-300' : 'text-gray-700'}
                        ${isEdge ? 'bg-blue-600 text-white font-semibold' : ''}
                        ${inRange && !isEdge ? 'text-blue-900' : ''}
                        ${isToday && !isEdge ? 'font-bold text-blue-600' : ''}
                        ${!inRange ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      {date.getDate()}
                      {hasEvents && !isEdge && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
