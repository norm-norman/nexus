const STORAGE_KEY = 'nexus:calendars';

interface SavedCalendar {
  url: string;
  name: string;
}

export function loadSavedCalendars(): SavedCalendar[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCalendar[];
  } catch {
    return [];
  }
}

export function saveCalendars(calendars: { url: string; name: string }[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
  } catch {
    // storage full or unavailable
  }
}
