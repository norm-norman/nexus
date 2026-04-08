// apps/mobile/app/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { AllCalendarsEventsData, CalendarFeedEvent, ListCalendarsResponse } from '@nexus/types';

type MobileEvent = CalendarFeedEvent & { id: string };

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

export default function App() {
  const [calendars, setCalendars] = useState<string[]>([]);
  const [events, setEvents] = useState<MobileEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      const calendarsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/calendars`);
      const calendarsJson = (await calendarsResponse.json()) as ListCalendarsResponse;
      setCalendars(calendarsJson.data.map((calendar) => calendar.id));
    };
    fetchCalendars();

    const fetchEvents = async () => {
      const eventsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/calendars/events`);
      const eventsJson = (await eventsResponse.json()) as { data: AllCalendarsEventsData };
      const eventsData = eventsJson.data;

      const massagedEvents: MobileEvent[] = eventsData.flatMap((entry) => {
        const calendarId = Object.keys(entry)[0]!;
        const calendarEvents = entry[calendarId] ?? [];
        if (!Array.isArray(calendarEvents)) return [];

        return calendarEvents.map((event, idx) => ({
          ...event,
          id: `${calendarId}:${event.title ?? 'event'}:${event.start ?? ''}:${idx}`,
        }));
      });

      setEvents(massagedEvents);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading Nexus Map...</Text>
      </View>
    );
  }

  console.log(events[0]);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {events.map((event) => {
          const lat = toNumber(event.geo?.lat);
          const lon = toNumber(event.geo?.lon);
          if (lat === null || lon === null) return null;

          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: lat, longitude: lon }}
              title={event.title}
              description={event.start ? new Date(event.start).toLocaleString() : undefined}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});