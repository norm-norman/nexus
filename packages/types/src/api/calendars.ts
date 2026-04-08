import type { ApiResponse } from './common';

/** Geocoordinates resolved for an event location (Mapbox / prior geocoder). */
export interface GeocodedLocation {
  name: string | null;
  display_name?: string | null;
  lat: number | string | null;
  lon: number | string | null;
}

/** POST /calendars — request body */
export interface CreateCalendarRequestBody {
  url: string;
}

/** Stored calendar row as returned in JSON (datetimes are ISO 8601 strings). */
export interface CalendarDto {
  id: string;
  url: string;
  name: string;
  description: string | null;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Single event from an iCal feed after parsing (JSON: dates are ISO strings). */
export interface CalendarFeedEvent {
  title: string;
  start: string;
  end: string;
  geo: GeocodedLocation | null;
  description?: string;
}

/** POST /calendars — `data` field on success */
export interface CreateCalendarResult {
  id: string;
}

/** GET /calendars */
export type ListCalendarsResponse = ApiResponse<CalendarDto[]>;

/** POST /calendars */
export type CreateCalendarResponse = ApiResponse<CreateCalendarResult>;

/** GET /calendars/:calendarId/events (`data` is null when calendar is missing) */
export type GetCalendarEventsResponse = ApiResponse<CalendarFeedEvent[] | null>;

/**
 * GET /calendars/events
 * One object per calendar, keyed by calendar id.
 * Values may be null if the calendar could not be loaded.
 */
export type AllCalendarsEventsData = Array<
  Record<string, CalendarFeedEvent[] | null>
>;

/** GET /calendars/events */
export type GetAllCalendarEventsResponse = ApiResponse<AllCalendarsEventsData>;
