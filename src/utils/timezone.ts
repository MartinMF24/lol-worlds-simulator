import { TIMEZONE_OPTIONS, TimezoneOption } from '../types/timezone';

/**
 * Formats match time as HH:mm for the given timezone.
 */
export function formatMatchTime(
  isoString: string | undefined,
  timeZoneOption: TimezoneOption | string = 'ART'
): string {
  if (!isoString) return '';
  try {
    const timeZone =
      typeof timeZoneOption === 'string' && timeZoneOption in TIMEZONE_OPTIONS
        ? TIMEZONE_OPTIONS[timeZoneOption as TimezoneOption].timeZone
        : timeZoneOption;

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(date);
  } catch (err) {
    console.error('[formatMatchTime] Error formatting date:', err);
    return '';
  }
}

/**
 * Formats match date header as "20 de Octubre" for the given timezone.
 */
export function formatMatchDateHeader(
  isoString: string | undefined,
  timeZoneOption: TimezoneOption | string = 'ART'
): string {
  if (!isoString) return '';
  try {
    const timeZone =
      typeof timeZoneOption === 'string' && timeZoneOption in TIMEZONE_OPTIONS
        ? TIMEZONE_OPTIONS[timeZoneOption as TimezoneOption].timeZone
        : timeZoneOption;

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric', timeZone }).format(date);
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long', timeZone }).format(date);

    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  } catch (err) {
    console.error('[formatMatchDateHeader] Error formatting header:', err);
    return '';
  }
}

/**
 * Formats an array of match date strings into a concise date range.
 * Examples:
 * - Single day: "23 de Octubre"
 * - Same month interval: "25-26 de Octubre"
 * - Cross month interval: "31 de Octubre - 2 de Noviembre"
 */
export function formatMatchDateRange(
  isoStrings: (string | undefined | null)[],
  timeZoneOption: TimezoneOption | string = 'ART'
): string | null {
  const validStrings = isoStrings.filter((s): s is string => !!s);
  if (validStrings.length === 0) return null;

  try {
    const timeZone =
      typeof timeZoneOption === 'string' && timeZoneOption in TIMEZONE_OPTIONS
        ? TIMEZONE_OPTIONS[timeZoneOption as TimezoneOption].timeZone
        : timeZoneOption;

    const dates = validStrings
      .map((s) => new Date(s))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) return null;

    const getParts = (d: Date) => {
      const parts = new Intl.DateTimeFormat('es-ES', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).formatToParts(d);

      const year = Number(parts.find((p) => p.type === 'year')?.value || 0);
      const monthNum = Number(parts.find((p) => p.type === 'month')?.value || 0);
      const dayNum = Number(parts.find((p) => p.type === 'day')?.value || 0);

      const monthNameRaw = new Intl.DateTimeFormat('es-ES', {
        timeZone,
        month: 'long',
      }).format(d);
      const monthName = monthNameRaw.charAt(0).toUpperCase() + monthNameRaw.slice(1);

      return {
        year,
        monthNum,
        monthName,
        dayNum,
        key: `${year}-${monthNum}-${dayNum}`,
      };
    };

    const firstParts = getParts(dates[0]);
    const lastParts = getParts(dates[dates.length - 1]);

    // Single day
    if (firstParts.key === lastParts.key) {
      return `${firstParts.dayNum} de ${firstParts.monthName}`;
    }

    // Same month and same year: e.g. "25-26 de Octubre"
    if (firstParts.year === lastParts.year && firstParts.monthNum === lastParts.monthNum) {
      return `${firstParts.dayNum}-${lastParts.dayNum} de ${firstParts.monthName}`;
    }

    // Same year, different months: e.g. "31 de Octubre - 2 de Noviembre"
    if (firstParts.year === lastParts.year) {
      return `${firstParts.dayNum} de ${firstParts.monthName} - ${lastParts.dayNum} de ${lastParts.monthName}`;
    }

    // Cross year
    return `${firstParts.dayNum} de ${firstParts.monthName} ${firstParts.year} - ${lastParts.dayNum} de ${lastParts.monthName} ${lastParts.year}`;
  } catch (err) {
    console.error('[formatMatchDateRange] Error formatting date range:', err);
    return null;
  }
}

/**
 * Returns a unique string key (YYYY-MM-DD) for a given match date in the specified timezone.
 * Useful to detect when consecutive matches transition to a new day.
 */
export function getMatchDateKey(
  isoString: string | undefined | null,
  timeZoneOption: TimezoneOption | string = 'ART'
): string {
  if (!isoString) return '';
  try {
    const timeZone =
      typeof timeZoneOption === 'string' && timeZoneOption in TIMEZONE_OPTIONS
        ? TIMEZONE_OPTIONS[timeZoneOption as TimezoneOption].timeZone
        : timeZoneOption;

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);

    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}
