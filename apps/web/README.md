# Nexus Web

The main web application for Nexus. Lets users load iCal calendars and visualize events on an interactive map.

## Features

- **iCal import** — paste any `.ics` URL to load calendar events
- **Multiple calendars** — add, toggle visibility, refresh, or remove calendars independently
- **Interactive map** — events with locations are geocoded and plotted on a Mapbox map
- **Mini calendar** — month view with date range selection to filter events
- **Location details** — click an event or marker to see a detail card with directions links
- **Persistence** — linked calendars are saved to localStorage and restored on reload

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/) via [react-map-gl](https://visgl.github.io/react-map-gl/)
- [ical.js](https://github.com/kewisch/ical.js) for iCal parsing
- [Tailwind CSS](https://tailwindcss.com) for styling
- Shared types from `@nexus/types`

## Setup

1. Copy `.env.example` to `.env.local` and add your Mapbox token
2. Run `pnpm dev` from the monorepo root (or `pnpm dev --filter web`)

## Project Layout

```
src/
  app/           Pages, layout, API routes
  components/    UI components (MapView, drawers, calendar, search bar)
  lib/           Utilities (iCal fetching, localStorage persistence)
```
