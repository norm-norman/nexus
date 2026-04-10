import { useCallback, useEffect, useState } from 'react';
import type {
  AllCalendarsEventsData,
  CalendarDto,
  CreateCalendarResponse,
  ListCalendarsResponse,
} from '@nexus/types';
import type { MobileEvent } from '../types/mobile';
import { toMobileEvents } from '../utils/events';

interface UseCalendarDataResult {
  calendars: CalendarDto[];
  events: MobileEvent[];
  loading: boolean;
  submitting: boolean;
  errorMessage: string | null;
  refreshData: () => Promise<void>;
  addCalendar: (url: string) => Promise<boolean>;
}

export function useCalendarData(apiUrl: string | undefined): UseCalendarDataResult {
  const [calendars, setCalendars] = useState<CalendarDto[]>([]);
  const [events, setEvents] = useState<MobileEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!apiUrl) {
      setErrorMessage('Missing EXPO_PUBLIC_API_URL');
      setLoading(false);
      return;
    }

    try {
      setErrorMessage(null);
      const calendarsResponse = await fetch(`${apiUrl}/calendars`);
      const calendarsJson = (await calendarsResponse.json()) as ListCalendarsResponse;
      setCalendars(calendarsJson.data);

      const eventsResponse = await fetch(`${apiUrl}/calendars/events`);
      const eventsJson = (await eventsResponse.json()) as { data: AllCalendarsEventsData };
      setEvents(toMobileEvents(eventsJson.data));
    } catch {
      setErrorMessage('Unable to load calendars/events.');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const addCalendar = useCallback(async (url: string) => {
    const trimmed = url.trim();
    if (!apiUrl) {
      setErrorMessage('Missing EXPO_PUBLIC_API_URL');
      return false;
    }
    if (!trimmed) {
      setErrorMessage('Paste an iCal URL first.');
      return false;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      const response = await fetch(`${apiUrl}/calendars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const createJson = (await response.json()) as CreateCalendarResponse;
      if (!response.ok || !createJson?.data?.id) {
        throw new Error('Create calendar failed');
      }
      await refreshData();
      return true;
    } catch {
      setErrorMessage('Could not add calendar from that URL.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [apiUrl, refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    calendars,
    events,
    loading,
    submitting,
    errorMessage,
    refreshData,
    addCalendar,
  };
}
