import { Team, Match } from '../types/swiss';

/**
 * Strips potentially dangerous control characters, zero-width characters,
 * and unsafe markup from user-provided or dynamic strings.
 */
export function sanitizeString(input: unknown, maxLength = 100): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[^\x20-\x7E\u00A0-\u024F\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates whether a given team object has valid structure and bounds.
 */
export function isValidTeam(team: unknown): team is Team {
  if (!team || typeof team !== 'object') return false;
  const t = team as Partial<Team>;
  return (
    typeof t.id === 'string' &&
    t.id.length > 0 &&
    typeof t.name === 'string' &&
    typeof t.region === 'string' &&
    typeof t.wins === 'number' &&
    t.wins >= 0 &&
    t.wins <= 3 &&
    typeof t.losses === 'number' &&
    t.losses >= 0 &&
    t.losses <= 3 &&
    Array.isArray(t.pastOpponents)
  );
}

/**
 * Validates that winnerId belongs to one of the two competing teams in the match.
 */
export function isValidMatchWinner(match: Match | undefined, winnerId: string | null | undefined): boolean {
  if (!match || !winnerId) return false;
  return match.team1.id === winnerId || match.team2.id === winnerId;
}
