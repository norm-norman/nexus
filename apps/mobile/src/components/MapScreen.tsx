import React from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderHandlers,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import type { MobileEvent } from '../types/mobile';
import { toNumber } from '../utils/number';

interface MapScreenProps {
  events: MobileEvent[];
  sortedEvents: MobileEvent[];
  selectedEventId: string | null;
  initialRegion: Region;
  mapRef: React.RefObject<MapView | null>;
  onMapPress: () => void;
  onRegionChangeComplete: (region: Region) => void;
  onMarkerPress: (event: MobileEvent) => void;
  onEventPress: (event: MobileEvent) => void;
  drawerTranslateY: Animated.Value;
  drawerExpandedHeight: number;
  tabBarHeight: number;
  drawerPanHandlers: GestureResponderHandlers;
}

export function MapScreen({
  events,
  sortedEvents,
  selectedEventId,
  initialRegion,
  mapRef,
  onMapPress,
  onRegionChangeComplete,
  onMarkerPress,
  onEventPress,
  drawerTranslateY,
  drawerExpandedHeight,
  tabBarHeight,
  drawerPanHandlers,
}: MapScreenProps) {
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={onMapPress}
        onRegionChangeComplete={onRegionChangeComplete}
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
              onPress={() => onMarkerPress(event)}
            />
          );
        })}
      </MapView>

      <Animated.View
        style={[
          styles.drawer,
          {
            height: drawerExpandedHeight,
            bottom: tabBarHeight,
            transform: [{ translateY: drawerTranslateY }],
          },
        ]}
      >
        <View style={styles.drawerHandleArea} {...drawerPanHandlers}>
          <View style={styles.drawerHandle} />
          <Text style={styles.drawerTitle}>Upcoming events ({sortedEvents.length})</Text>
        </View>
        <FlatList
          data={sortedEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.drawerContent}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.eventItem,
                selectedEventId === item.id ? styles.eventItemActive : null,
              ]}
              onPress={() => onEventPress(item)}
            >
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.title || 'Untitled event'}
              </Text>
              <Text style={styles.eventMeta}>
                {item.start ? new Date(item.start).toLocaleString() : 'No start time'}
              </Text>
              <Text style={styles.eventMeta} numberOfLines={1}>
                {item.geo?.display_name || item.geo?.name || 'No location'}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No events yet. Use Add tab to add an iCal feed.
            </Text>
          }
        />
      </Animated.View>
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
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerHandleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  drawerHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#C7C7CC',
    marginBottom: 8,
  },
  drawerTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  drawerContent: {
    padding: 12,
    gap: 10,
    paddingBottom: 40,
  },
  eventItem: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eventItemActive: {
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#EEF5FF',
  },
  eventTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  eventMeta: {
    color: '#555',
    fontSize: 12,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});
