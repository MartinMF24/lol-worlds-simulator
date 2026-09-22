import { Team } from './swiss';

export type PlayoffRoundType = 'quarter' | 'semi' | 'final';

export interface PlayoffMatch {
  id: string; // 'qf-1', 'qf-2', 'qf-3', 'qf-4', 'sf-1', 'sf-2', 'f-1'
  round: PlayoffRoundType;
  matchIndex: number; // 0 to 3 for quarters, 0 to 1 for semis, 0 for final
  team1: Team | null;
  team2: Team | null;
  winnerId: string | null;
  nextMatchId: string | null;
  nextSlot: 1 | 2; // Slot 1 (top) or 2 (bottom) in the next match
}

export interface PlayoffBracket {
  quarters: PlayoffMatch[];
  semis: PlayoffMatch[];
  final: PlayoffMatch;
  champion: Team | null;
}

