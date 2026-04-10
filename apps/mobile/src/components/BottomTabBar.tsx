import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ActiveScreen } from '../types/mobile';

interface BottomTabBarProps {
  activeScreen: ActiveScreen;
  onChangeScreen: (screen: ActiveScreen) => void;
  height: number;
}

export function BottomTabBar({
  activeScreen,
  onChangeScreen,
  height,
}: BottomTabBarProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Pressable
        style={[styles.tabButton, activeScreen === 'map' ? styles.tabButtonActive : null]}
        onPress={() => onChangeScreen('map')}
      >
        <Text style={[styles.tabText, activeScreen === 'map' ? styles.tabTextActive : null]}>
          Map
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tabButton, activeScreen === 'calendar' ? styles.tabButtonActive : null]}
        onPress={() => onChangeScreen('calendar')}
      >
        <Text style={[styles.tabText, activeScreen === 'calendar' ? styles.tabTextActive : null]}>
          Calendars
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#F3F8FF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
});
