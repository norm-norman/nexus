export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  location: string | null;
  startTime: string;
  endTime: string | null;
  lat: number | null;
  lon: number | null;
}

export interface CalendarSource {
  id: string;
  url: string;
  name: string;
  eventCount: number;
  visible: boolean;
}
