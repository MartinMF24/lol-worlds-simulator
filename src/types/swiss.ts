export type Region = 
  | 'LPL' 
  | 'LCK' 
  | 'LEC' 
  | 'PCS/VCS' 
  | 'LCS' 
  | 'CBLOL' 
  | 'Wildcard';

export interface Team {
  id: string;
  name: string;
  region: Region;
  seed: 1 | 2 | 3 | 4;
  wins: number;
  losses: number;
  pastOpponents: string[]; // List of opponent team IDs
  imageKey: string;
}

export interface Match {
  id: string;
  round: number;
  poolRecord: string; // e.g. "0-0", "1-0", "0-1", "2-0", "1-1", "0-2", "2-1", "1-2", "2-2"
  team1: Team;
  team2: Team;
  winnerId: string | null;
  isHighMatch?: boolean; // Win advances to playoffs (at 2 wins: 2-0, 2-1, 2-2)
  isLowMatch?: boolean;  // Loss eliminates from tournament (at 2 losses: 0-2, 1-2, 2-2)
}

export interface Round {
  roundNumber: number;
  matches: Match[];
  isCompleted: boolean;
}

