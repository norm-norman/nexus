export interface FocusSelectionAccessors<T> {
  getLat: (item: T) => number | null | undefined;
  getLon: (item: T) => number | null | undefined;
  getStartTime: (item: T) => string | null | undefined;
}

/**
 * Select the event to focus on:
 * 1) next upcoming event with coordinates,
 * 2) otherwise the latest dated event with coordinates.
 */
export function selectFocusEvent<T>(
  items: T[],
  accessors: FocusSelectionAccessors<T>,
): T | null {
  const located = items.filter((item) => {
    const lat = accessors.getLat(item);
    const lon = accessors.getLon(item);
    return lat != null && lon != null;
  });

  if (located.length === 0) {
    return null;
  }

  const now = Date.now();
  const sorted = [...located]
    .filter((item) => Boolean(accessors.getStartTime(item)))
    .sort((a, b) => {
      const left = new Date(accessors.getStartTime(a) ?? 0).getTime();
      const right = new Date(accessors.getStartTime(b) ?? 0).getTime();
      return left - right;
    });

  const nextUpcoming = sorted.find(
    (item) => new Date(accessors.getStartTime(item) ?? 0).getTime() >= now,
  );
  return nextUpcoming ?? sorted[sorted.length - 1] ?? null;
}
