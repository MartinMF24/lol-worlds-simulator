import { Team } from '../types/swiss';
import { PlayoffBracket, PlayoffMatch } from '../types/playoffs';
import { shuffle } from './swissDraw';

/**
 * Generates the initial Quarterfinals draw and sets up the empty bracket tree
 * strictly respecting Worlds Knockout seeding rules:
 * 1. Two 3-0 teams play against two 3-2 teams (randomly selected).
 * 2. Leftover 3-2 plays against a 3-1 team (randomly selected).
 * 3. Remaining two 3-1 teams play each other.
 * 4. The two 3-0 teams are placed in opposite halves of the bracket (Top vs Bottom)
 *    so they can only meet in the Grand Final.
 */
export function generatePlayoffsBracket(qualifiedTeams: Team[]): PlayoffBracket {
  const teams3_0 = qualifiedTeams.filter((t) => t.losses === 0);
  const teams3_1 = qualifiedTeams.filter((t) => t.losses === 1);
  const teams3_2 = qualifiedTeams.filter((t) => t.losses === 2);

  if (teams3_0.length !== 2 || teams3_1.length !== 3 || teams3_2.length !== 3) {
    throw new Error(
      `Conteo inválido de equipos para playoffs. Se requieren 2 equipos (3-0), 3 equipos (3-1) y 3 equipos (3-2). Obtenidos: ${teams3_0.length} de 3-0, ${teams3_1.length} de 3-1, ${teams3_2.length} de 3-2.`
    );
  }

  // Shuffle for fair randomness
  const shuffled3_0 = shuffle(teams3_0);
  const shuffled3_1 = shuffle(teams3_1);
  const shuffled3_2 = shuffle(teams3_2);

  // Pairings:
  // Top Half:
  // Match 1: 3-0 Team #1 vs 3-2 Team #1
  const [m1Team1, m1Team2] = Math.random() > 0.5 
    ? [shuffled3_0[0], shuffled3_2[0]] 
    : [shuffled3_2[0], shuffled3_0[0]];

  // Match 2: 3-1 Team #1 vs leftover 3-2 Team #3
  const [m2Team1, m2Team2] = Math.random() > 0.5 
    ? [shuffled3_1[0], shuffled3_2[2]] 
    : [shuffled3_2[2], shuffled3_1[0]];

  // Bottom Half:
  // Match 3: Remaining two 3-1 teams (Team #2 vs Team #3)
  const [m3Team1, m3Team2] = Math.random() > 0.5 
    ? [shuffled3_1[1], shuffled3_1[2]] 
    : [shuffled3_1[2], shuffled3_1[1]];

  // Match 4: 3-0 Team #2 vs 3-2 Team #2
  const [m4Team1, m4Team2] = Math.random() > 0.5 
    ? [shuffled3_0[1], shuffled3_2[1]] 
    : [shuffled3_2[1], shuffled3_0[1]];

  const quarters: PlayoffMatch[] = [
    {
      id: 'qf-1',
      round: 'quarter',
      matchIndex: 0,
      team1: m1Team1,
      team2: m1Team2,
      winnerId: null,
      nextMatchId: 'sf-1',
      nextSlot: 1,
    },
    {
      id: 'qf-2',
      round: 'quarter',
      matchIndex: 1,
      team1: m2Team1,
      team2: m2Team2,
      winnerId: null,
      nextMatchId: 'sf-1',
      nextSlot: 2,
    },
    {
      id: 'qf-3',
      round: 'quarter',
      matchIndex: 2,
      team1: m3Team1,
      team2: m3Team2,
      winnerId: null,
      nextMatchId: 'sf-2',
      nextSlot: 1,
    },
    {
      id: 'qf-4',
      round: 'quarter',
      matchIndex: 3,
      team1: m4Team1,
      team2: m4Team2,
      winnerId: null,
      nextMatchId: 'sf-2',
      nextSlot: 2,
    },
  ];

  const semis: PlayoffMatch[] = [
    {
      id: 'sf-1',
      round: 'semi',
      matchIndex: 0,
      team1: null,
      team2: null,
      winnerId: null,
      nextMatchId: 'f-1',
      nextSlot: 1,
    },
    {
      id: 'sf-2',
      round: 'semi',
      matchIndex: 1,
      team1: null,
      team2: null,
      winnerId: null,
      nextMatchId: 'f-1',
      nextSlot: 2,
    },
  ];

  const final: PlayoffMatch = {
    id: 'f-1',
    round: 'final',
    matchIndex: 0,
    team1: null,
    team2: null,
    winnerId: null,
    nextMatchId: null,
    nextSlot: 1,
  };

  return {
    quarters,
    semis,
    final,
    champion: null,
  };
}

