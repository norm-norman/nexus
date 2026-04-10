import { selectFocusEvent } from '@nexus/location-utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { DEFAULT_LATITUDE_DELTA, DEFAULT_LONGITUDE_DELTA } from '../constants/layout';
import type { MobileEvent } from '../types/mobile';
import { toNumber } from '../utils/number';

interface UseMapFocusParams {
  events: MobileEvent[];
  drawerExpandedHeight: number;
  tabBarHeight: number;
  windowHeight: number;
  drawerCollapsedTranslate: number;
  getDrawerTranslate: () => number;
  collapseDrawer: () => void;
  onActivateMap: () => void;
}

interface UseMapFocusResult {
  mapRef: React.RefObject<MapView | null>;
  selectedEventId: string | null;
  initialRegion: Region;
  onMapPress: () => void;
  onRegionChangeComplete: (region: Region) => void;
  onMarkerPress: (event: MobileEvent) => void;
  focusMapOnEvent: (event: MobileEvent) => void;
}

export function useMapFocus({
  events,
  drawerExpandedHeight,
  tabBarHeight,
  windowHeight,
  drawerCollapsedTranslate,
  getDrawerTranslate,
  collapseDrawer,
  onActivateMap,
}: UseMapFocusParams): UseMapFocusResult {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const currentRegionRef = useRef<Region | null>(null);
  const markerPressRef = useRef(false);

  const focusMapCoordinate = useCallback((lat: number, lon: number, duration = 1000) => {
    if (!mapRef.current) return;

    const region = currentRegionRef.current;
    const latitudeDelta = region?.latitudeDelta ?? DEFAULT_LATITUDE_DELTA;
    const longitudeDelta = region?.longitudeDelta ?? DEFAULT_LONGITUDE_DELTA;
    // Keep a small baseline so focused pins stay clear of the drawer edge.
    const drawerTranslateOffset = 24;
    const visibleDrawerHeight = Math.max(
      0,
      drawerExpandedHeight - Math.max(0, getDrawerTranslate() - drawerTranslateOffset),
    );
    const obscuredBottomHeight = Math.min(windowHeight, visibleDrawerHeight + tabBarHeight);
    const obscuredRatio = obscuredBottomHeight / windowHeight;
    const latitudeOffset = latitudeDelta * obscuredRatio * 0.5;

    mapRef.current.animateToRegion(
      {
        latitude: lat - latitudeOffset,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
      },
      duration,
    );
  }, [drawerExpandedHeight, getDrawerTranslate, tabBarHeight, windowHeight]);

  const focusMapOnEvent = useCallback((event: MobileEvent) => {
    const lat = toNumber(event.geo?.lat);
    const lon = toNumber(event.geo?.lon);

    setSelectedEventId(event.id);
    onActivateMap();

    if (lat === null || lon === null) return;
    focusMapCoordinate(lat, lon);
  }, [focusMapCoordinate, onActivateMap]);

  const onMapPress = useCallback(() => {
    if (markerPressRef.current) {
      markerPressRef.current = false;
      return;
    }

    if (getDrawerTranslate() < drawerCollapsedTranslate - 4) {
      collapseDrawer();
    }
  }, [collapseDrawer, drawerCollapsedTranslate, getDrawerTranslate]);

  const onMarkerPress = useCallback((event: MobileEvent) => {
    markerPressRef.current = true;
    focusMapOnEvent(event);
  }, [focusMapOnEvent]);

  const focusEvent = useMemo(() => {
    return selectFocusEvent(events, {
      getLat: (event) => toNumber(event.geo?.lat),
      getLon: (event) => toNumber(event.geo?.lon),
      getStartTime: (event) => event.start,
    });
  }, [events]);

  useEffect(() => {
    const lat = toNumber(focusEvent?.geo?.lat);
    const lon = toNumber(focusEvent?.geo?.lon);
    if (lat === null || lon === null) return;
    focusMapCoordinate(lat, lon, 1500);
  }, [focusEvent, focusMapCoordinate]);

  const initialRegion = useMemo<Region>(() => {
    const lat = toNumber(focusEvent?.geo?.lat);
    const lon = toNumber(focusEvent?.geo?.lon);
    return {
      latitude: lat ?? 40.7128,
      longitude: lon ?? -74.0060,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    };
  }, [focusEvent]);

  const onRegionChangeComplete = useCallback((region: Region) => {
    currentRegionRef.current = region;
  }, []);

  return {
    mapRef,
    selectedEventId,
    initialRegion,
    onMapPress,
    onRegionChangeComplete,
    onMarkerPress,
    focusMapOnEvent,
  };
}
