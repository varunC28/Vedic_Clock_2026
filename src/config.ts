/**
 * Kiosk-wide constants. The clock is India-only, so IST stays hardcoded.
 * Location is now dynamic — DEFAULT_LOCATION is the fallback used when
 * the user hasn't chosen a location yet.
 *
 * Lat/lon are Drik Panchang's Bhopal anchor (23°15′35″ N, 77°24′40″ E).
 * Height is sea level; for sunrise refraction-corrected to −0.833° it
 * doesn't matter at 500 m elevation.
 */

export interface LocationConfig {
  city: string;
  cityHi: string;
  /** Decimal degrees, north positive. */
  latitude: number;
  /** Decimal degrees, east positive. */
  longitude: number;
  /** Metres above sea level. */
  heightMeters: number;
}

export const DEFAULT_LOCATION: LocationConfig = {
  city: 'Bhopal',
  cityHi: 'भोपाल',
  latitude: 23.2599,
  longitude: 77.4126,
  heightMeters: 500,
};

/** IST is UTC+5:30, never DST. Use this to convert UTC↔IST for display. */
export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Convert a UTC Date to an IST-shifted Date (a "wall clock" Date). */
export function toIst(utc: Date): Date {
  return new Date(utc.getTime() + IST_OFFSET_MS);
}

/** Convert an IST-shifted "wall clock" Date back to a real UTC Date. */
export function fromIst(istWall: Date): Date {
  return new Date(istWall.getTime() - IST_OFFSET_MS);
}
