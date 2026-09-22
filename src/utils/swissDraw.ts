import { Team, Match } from '../types/swiss';

/**
 * Utility to shuffle an array immutably (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Round 1 Pairing:
 * Seed 1 vs Seed 4 (4 matches)
 * Seed 2 vs Seed 3 (4 matches)
 * Absolute restriction: No same-region matchups.
 */
export function generateRound1(teams: Team[]): Match[] {
  const seed1 = teams.filter((t) => t.seed === 1);
  const seed4 = teams.filter((t) => t.seed === 4);
  const seed2 = teams.filter((t) => t.seed === 2);
  const seed3 = teams.filter((t) => t.seed === 3);

  const matches1v4 = pairSeedsNoSameRegion(seed1, seed4, 1);
  const matches2v3 = pairSeedsNoSameRegion(seed2, seed3, 1);

  return [...matches1v4, ...matches2v3];
}

/**
 * Backtracking bipartite matcher between two seed groups with region check
 */
function pairSeedsNoSameRegion(
  groupA: Team[],
  groupB: Team[],
  roundNumber: number
): Match[] {
  // Retry loop in case a random path hits a branch with no solution
  for (let attempt = 0; attempt < 50; attempt++) {
    const shuffledA = shuffle(groupA);
    const shuffledB = shuffle(groupB);

    const result = solveBipartite(shuffledA, shuffledB);
    if (result) {
      return result.map(([t1, t2], index) => {
        // Randomize team1 vs team2 sides for presentation
        const [left, right] = Math.random() > 0.5 ? [t1, t2] : [t2, t1];
        return {
          id: `r${roundNumber}-m${left.id}-${right.id}`,
          round: roundNumber,
          poolRecord: '0-0',
          team1: left,
          team2: right,
          winnerId: null,
          isHighMatch: false,
          isLowMatch: false,
        };
      });
    }
  }

  throw new Error('No se pudo encontrar un emparejamiento válido para la Ronda 1 sin cruces de misma región.');
}

function solveBipartite(
  remainingA: Team[],
  availableB: Team[]
): [Team, Team][] | null {
  if (remainingA.length === 0) return [];

  const currentA = remainingA[0];
  const restA = remainingA.slice(1);

  for (let i = 0; i < availableB.length; i++) {
    const candidateB = availableB[i];

    // Restriction: Cannot be from the same region
    if (currentA.region !== candidateB.region) {
      const restB = availableB.filter((_, idx) => idx !== i);
      const subResult = solveBipartite(restA, restB);
      if (subResult !== null) {
        return [[currentA, candidateB], ...subResult];
      }
    }
  }

  return null;
}

/**
 * Rounds 2 to 5 Pairing:
 * 1. Filter active teams (wins < 3 && losses < 3)
 * 2. Group by exact record (wins-losses)
 * 3. Pair each pool using backtracking to avoid pastOpponents
 */
export function generateSubsequentRound(teams: Team[], roundNumber: number): Match[] {
  const activeTeams = teams.filter((t) => t.wins < 3 && t.losses < 3);

  // Group teams by record key "wins-losses"
  const pools: Record<string, Team[]> = {};
  for (const team of activeTeams) {
    const key = `${team.wins}-${team.losses}`;
    if (!pools[key]) pools[key] = [];
    pools[key].push(team);
  }

  const allMatches: Match[] = [];

  // Iterate over each pool and pair
  for (const [recordKey, poolTeams] of Object.entries(pools)) {
    if (poolTeams.length % 2 !== 0) {
      throw new Error(`El pool con récord ${recordKey} tiene un número impar de equipos: ${poolTeams.length}`);
    }

    const pairs = pairPoolNoRematch(poolTeams);
    if (!pairs) {
      throw new Error(`No se pudo emparejar el pool ${recordKey} sin revanchas.`);
    }

    const [w] = recordKey.split('-').map(Number);
    const [, l] = recordKey.split('-').map(Number);
    const isHighMatch = w === 2; // Win promotes to 3 wins (playoffs)
    const isLowMatch = l === 2;  // Loss drops to 3 losses (elimination)

    pairs.forEach(([t1, t2]) => {
      const [left, right] = Math.random() > 0.5 ? [t1, t2] : [t2, t1];
      allMatches.push({
        id: `r${roundNumber}-m${left.id}-${right.id}`,
        round: roundNumber,
        poolRecord: recordKey,
        team1: left,
        team2: right,
        winnerId: null,
        isHighMatch,
        isLowMatch,
      });
    });
  }

  return allMatches;
}

/**
 * Backtracking solver to pair a pool of teams without rematches
 */
function pairPoolNoRematch(teams: Team[]): [Team, Team][] | null {
  for (let attempt = 0; attempt < 50; attempt++) {
    const shuffled = shuffle(teams);
    const result = solvePool(shuffled);
    if (result) return result;
  }
  return null;
}

function solvePool(remaining: Team[]): [Team, Team][] | null {
  if (remaining.length === 0) return [];

  const current = remaining[0];
  const rest = remaining.slice(1);

  // Shuffle candidates for fair randomness
  const candidates = shuffle(
    rest.filter((candidate) => !current.pastOpponents.includes(candidate.id))
  );

  for (const candidate of candidates) {
    const nextRemaining = rest.filter((t) => t.id !== candidate.id);
    const subResult = solvePool(nextRemaining);
    if (subResult !== null) {
      return [[current, candidate], ...subResult];
    }
  }

  return null;
}

/**
 * Master draw function:
 * If round === 1, calls generateRound1
 * Else, calls generateSubsequentRound
 */
export function drawSwissRound(teams: Team[], roundNumber: number): Match[] {
  if (roundNumber === 1) {
    return generateRound1(teams);
  }
  return generateSubsequentRound(teams, roundNumber);
}

