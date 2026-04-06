// apps/mobile/app/index.tsx
import React, { useState, useEffect } from 'react'; // Fixed Import
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Event {
  id: string;
  title: string;
  start: string;
  geo: {
    lat: number;
    lon: number;
  };
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('http://localhost:9000/calendar/events');
      const data = await response.json();
      setEvents(data);
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
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.geo.lat,
              longitude: event.geo.lon,
            }}
            title={event.title}
            description={new Date(event.start).toLocaleString()}
          />
        ))}
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