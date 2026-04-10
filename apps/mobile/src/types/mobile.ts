import type { CalendarFeedEvent } from '@nexus/types';

export type MobileEvent = CalendarFeedEvent & { id: string };

export type ActiveScreen = 'map' | 'calendar';
