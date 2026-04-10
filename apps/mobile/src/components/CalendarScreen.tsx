import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CalendarDto } from '@nexus/types';

interface CalendarScreenProps {
  calendars: CalendarDto[];
  markersCount: number;
  icalUrl: string;
  onChangeIcalUrl: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function CalendarScreen({
  calendars,
  markersCount,
  icalUrl,
  onChangeIcalUrl,
  onSubmit,
  submitting,
  errorMessage,
}: CalendarScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Add iCal feed</Text>
          <Text style={styles.subtitle}>Paste a public iCal URL, then submit.</Text>
          <TextInput
            value={icalUrl}
            onChangeText={onChangeIcalUrl}
            placeholder="https://.../calendar.ics"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable
            onPress={onSubmit}
            disabled={submitting}
            style={[styles.button, submitting ? styles.buttonDisabled : null]}
          >
            <Text style={styles.buttonText}>{submitting ? 'Adding...' : 'Add calendar'}</Text>
          </Pressable>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Calendars</Text>
          <Text style={styles.subtitle}>Connected feeds and quick add.</Text>
          <Text style={styles.meta}>
            Calendars: {calendars.length} • Markers: {markersCount}
          </Text>

          <View style={styles.list}>
            {calendars.length === 0 ? (
              <Text style={styles.empty}>No calendars yet. Add your first iCal feed below.</Text>
            ) : (
              calendars.map((calendar) => (
                <View key={calendar.id} style={styles.calendarRow}>
                  <Text style={styles.calendarName} numberOfLines={1}>
                    {calendar.name || 'Untitled calendar'}
                  </Text>
                  <Text style={styles.calendarUrl} numberOfLines={1}>
                    {calendar.url}
                  </Text>
                  <Text style={styles.calendarMeta} numberOfLines={1}>
                    {calendar.visible ? 'Visible' : 'Hidden'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3FF',
    paddingTop: 64,
    paddingBottom: 76,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  },
  subtitle: {
    color: '#555',
    fontSize: 13,
  },
  meta: {
    fontSize: 12,
    color: '#555',
  },
  list: {
    gap: 8,
  },
  empty: {
    color: '#777',
    fontSize: 13,
  },
  calendarRow: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
    backgroundColor: '#FAFAFA',
  },
  calendarName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1F2937',
  },
  calendarUrl: {
    fontSize: 12,
    color: '#4B5563',
  },
  calendarMeta: {
    fontSize: 11,
    color: '#6B7280',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    fontSize: 12,
    color: '#C62828',
  },
});
