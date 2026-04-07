'use client';

import { useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CalendarEvent } from '@nexus/types';

interface MapViewProps {
  events: CalendarEvent[];
  activeEvent: CalendarEvent | null;
  onMarkerClick: (event: CalendarEvent) => void;
  focusEvent: CalendarEvent | null;
}

export default function MapView({ events, activeEvent, onMarkerClick, focusEvent }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (focusEvent?.lat != null && focusEvent?.lon != null) {
      mapRef.current?.flyTo({
        center: [focusEvent.lon, focusEvent.lat],
        zoom: 13,
        duration: 1500,
      });
    }
  }, [focusEvent]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 12,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {events.map((evt) =>
        evt.lat != null && evt.lon != null ? (
          <Marker
            key={evt.id}
            longitude={evt.lon}
            latitude={evt.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onMarkerClick(evt);
            }}
          >
            <div
              className={`rounded-full border-2 shadow-md cursor-pointer transition-all duration-200 ${
                activeEvent?.id === evt.id
                  ? 'w-5 h-5 bg-blue-600 border-white scale-125'
                  : 'w-4 h-4 bg-red-500 border-white hover:scale-110'
              }`}
            />
          </Marker>
        ) : null
      )}
    </Map>
  );
}
