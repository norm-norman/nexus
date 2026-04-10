import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { DRAWER_PEEK_HEIGHT, TAB_BAR_HEIGHT } from './src/constants/layout';
import { CalendarScreen } from './src/components/CalendarScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { LoadingScreen } from './src/components/LoadingScreen';
import { MapScreen } from './src/components/MapScreen';
import { useCalendarData } from './src/hooks/useCalendarData';
import { useDrawerController } from './src/hooks/useDrawerController';
import { useMapFocus } from './src/hooks/useMapFocus';
import type { ActiveScreen } from './src/types/mobile';
import { sortEventsByStart } from './src/utils/events';

export default function App() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('map');
  const [icalUrl, setIcalUrl] = useState('');
  const windowHeight = Dimensions.get('window').height;
  const drawerExpandedHeight = Math.min(Math.max(windowHeight * 0.56, 320), 520);

  const {
    calendars,
    events,
    loading,
    submitting,
    errorMessage,
    addCalendar,
  } = useCalendarData(apiUrl);

  const {
    drawerTranslateY,
    drawerCollapsedTranslate,
    panHandlers,
    collapseDrawer,
    getDrawerTranslate,
  } = useDrawerController(drawerExpandedHeight, DRAWER_PEEK_HEIGHT);

  const {
    mapRef,
    selectedEventId,
    initialRegion,
    onMapPress,
    onRegionChangeComplete,
    onMarkerPress,
    focusMapOnEvent,
  } = useMapFocus({
    events,
    drawerExpandedHeight,
    tabBarHeight: TAB_BAR_HEIGHT,
    windowHeight,
    drawerCollapsedTranslate,
    getDrawerTranslate,
    collapseDrawer,
    onActivateMap: () => setActiveScreen('map'),
  });

  const sortedEvents = useMemo(() => sortEventsByStart(events), [events]);

  const handleSubmitCalendar = async () => {
    const wasAdded = await addCalendar(icalUrl);
    if (wasAdded) {
      setIcalUrl('');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {activeScreen === 'map' ? (
        <MapScreen
          events={events}
          sortedEvents={sortedEvents}
          selectedEventId={selectedEventId}
          initialRegion={initialRegion}
          mapRef={mapRef}
          onMapPress={onMapPress}
          onRegionChangeComplete={onRegionChangeComplete}
          onMarkerPress={onMarkerPress}
          onEventPress={focusMapOnEvent}
          drawerTranslateY={drawerTranslateY}
          drawerExpandedHeight={drawerExpandedHeight}
          tabBarHeight={TAB_BAR_HEIGHT}
          drawerPanHandlers={panHandlers}
        />
      ) : (
        <CalendarScreen
          calendars={calendars}
          markersCount={events.length}
          icalUrl={icalUrl}
          onChangeIcalUrl={setIcalUrl}
          onSubmit={handleSubmitCalendar}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      )}
      <BottomTabBar
        activeScreen={activeScreen}
        onChangeScreen={setActiveScreen}
        height={TAB_BAR_HEIGHT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});