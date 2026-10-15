import { TIMEZONE_OPTIONS, TimezoneOption } from '../types/timezone';

/**
 * Formats match time as HH:mm for the given timezone.
 */
export function formatMatchTime(isoString: string | undefined, timeZoneOption: TimezoneOption | string = 'ART'): string {
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
export function formatMatchDateHeader(isoString: string | undefined, timeZoneOption: TimezoneOption | string = 'ART'): string {
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
