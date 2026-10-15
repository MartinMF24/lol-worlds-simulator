export type TimezoneOption = 'ART' | 'CET' | 'CST';

export interface TimezoneConfig {
  id: TimezoneOption;
  label: string;
  country: string;
  city: string;
  timeZone: string;
  offsetLabel: string;
  flag: string;
}

export const TIMEZONE_OPTIONS: Record<TimezoneOption, TimezoneConfig> = {
  ART: {
    id: 'ART',
    label: 'Argentina (ART)',
    country: 'Argentina',
    city: 'Buenos Aires',
    timeZone: 'America/Argentina/Buenos_Aires',
    offsetLabel: 'UTC-3',
    flag: '🇦🇷',
  },
  CET: {
    id: 'CET',
    label: 'España (CET)',
    country: 'España',
    city: 'Madrid',
    timeZone: 'Europe/Madrid',
    offsetLabel: 'UTC+2',
    flag: '🇪🇸',
  },
  CST: {
    id: 'CST',
    label: 'México (CST)',
    country: 'México',
    city: 'CDMX',
    timeZone: 'America/Mexico_City',
    offsetLabel: 'UTC-6',
    flag: '🇲🇽',
  },
};
