import { Team } from '../types/swiss';
import { PlayoffBracket, PlayoffMatch } from '../types/playoffs';
import { RealPlayoffsData, RealPlayoffMatchData } from '../data/tournamentData';
import { BASE_15_TEAMS, PLAY_IN_CANDIDATES } from '../data/teams';
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
    isRealDraw: false,
  };
}

/**
 * Creates the Playoffs Bracket from the official real draw in tournamentData.ts.
 * Respects official winners and scheduled match times, and propagates winners
 * up through Semifinals and Final automatically.
 */
export function createRealPlayoffsBracket(
  realPlayoffs: RealPlayoffsData,
  qualifiedTeams?: Team[]
): PlayoffBracket {
  const allTeamsPool = [...BASE_15_TEAMS, ...PLAY_IN_CANDIDATES];

  const findTeam = (id: string | null | undefined): Team | null => {
    if (!id) return null;
    const matchQualified = qualifiedTeams?.find((t) => t.id === id);
    if (matchQualified) return { ...matchQualified };
    const matchBase = allTeamsPool.find((t) => t.id === id);
    if (matchBase) return { ...matchBase };
    return null;
  };

  const matchMap = new Map<string, RealPlayoffMatchData>();
  (realPlayoffs.matches || []).forEach((m) => matchMap.set(m.id, m));

  // 1. Quarters (qf-1, qf-2, qf-3, qf-4)
  const quarterIds = ['qf-1', 'qf-2', 'qf-3', 'qf-4'];
  const quarters: PlayoffMatch[] = quarterIds.map((id, index) => {
    const realMatch = matchMap.get(id);
    const team1 = findTeam(realMatch?.team1Id);
    const team2 = findTeam(realMatch?.team2Id);
    const winnerId = realMatch?.winnerId || null;
    const isOfficialWinner = !!realMatch?.winnerId;

    return {
      id,
      round: 'quarter',
      matchIndex: index,
      team1,
      team2,
      winnerId,
      nextMatchId: index < 2 ? 'sf-1' : 'sf-2',
      nextSlot: (index % 2 === 0 ? 1 : 2) as (1 | 2),
      scheduledTime: realMatch?.scheduledTime,
      isOfficialWinner,
    };
  });

  const getMatchWinnerTeam = (match: PlayoffMatch): Team | null => {
    if (!match.winnerId) return null;
    if (match.team1?.id === match.winnerId) return match.team1;
    if (match.team2?.id === match.winnerId) return match.team2;
    return null;
  };

  // 2. Semifinals (sf-1, sf-2)
  const sf1Real = matchMap.get('sf-1');
  const sf2Real = matchMap.get('sf-2');

  const sf1Team1 = getMatchWinnerTeam(quarters[0]) || findTeam(sf1Real?.team1Id);
  const sf1Team2 = getMatchWinnerTeam(quarters[1]) || findTeam(sf1Real?.team2Id);
  const sf2Team1 = getMatchWinnerTeam(quarters[2]) || findTeam(sf2Real?.team1Id);
  const sf2Team2 = getMatchWinnerTeam(quarters[3]) || findTeam(sf2Real?.team2Id);

  const semis: PlayoffMatch[] = [
    {
      id: 'sf-1',
      round: 'semi',
      matchIndex: 0,
      team1: sf1Team1,
      team2: sf1Team2,
      winnerId: sf1Real?.winnerId || null,
      nextMatchId: 'f-1',
      nextSlot: 1,
      scheduledTime: sf1Real?.scheduledTime,
      isOfficialWinner: !!sf1Real?.winnerId,
    },
    {
      id: 'sf-2',
      round: 'semi',
      matchIndex: 1,
      team1: sf2Team1,
      team2: sf2Team2,
      winnerId: sf2Real?.winnerId || null,
      nextMatchId: 'f-1',
      nextSlot: 2,
      scheduledTime: sf2Real?.scheduledTime,
      isOfficialWinner: !!sf2Real?.winnerId,
    },
  ];

  // 3. Final (f-1)
  const f1Real = matchMap.get('f-1');
  const f1Team1 = getMatchWinnerTeam(semis[0]) || findTeam(f1Real?.team1Id);
  const f1Team2 = getMatchWinnerTeam(semis[1]) || findTeam(f1Real?.team2Id);

  const final: PlayoffMatch = {
    id: 'f-1',
    round: 'final',
    matchIndex: 0,
    team1: f1Team1,
    team2: f1Team2,
    winnerId: f1Real?.winnerId || null,
    nextMatchId: null,
    nextSlot: 1,
    scheduledTime: f1Real?.scheduledTime,
    isOfficialWinner: !!f1Real?.winnerId,
  };

  const champion = getMatchWinnerTeam(final);

  return {
    quarters,
    semis,
    final,
    champion,
    isRealDraw: true,
  };
}
