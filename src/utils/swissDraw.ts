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
 * Backtracking bipartite matcher between two seed groups with region check.
 * Includes bounded attempts and fallback to prevent browser hang.
 */
function pairSeedsNoSameRegion(
  groupA: Team[],
  groupB: Team[],
  roundNumber: number
): Match[] {
  const MAX_ATTEMPTS = 50;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shuffledA = shuffle(groupA);
    const shuffledB = shuffle(groupB);

    const result = solveBipartite(shuffledA, shuffledB);
    if (result) {
      return result.map(([t1, t2]) => {
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

  // Graceful fallback in case of impossible region configuration:
  // Pair with minimal same-region clashes without throwing or hanging
  const fallbackPairs: [Team, Team][] = [];
  const remB = [...groupB];
  for (const a of groupA) {
    let bestIdx = remB.findIndex((b) => b.region !== a.region);
    if (bestIdx === -1) bestIdx = 0;
    fallbackPairs.push([a, remB[bestIdx]]);
    remB.splice(bestIdx, 1);
  }

  return fallbackPairs.map(([t1, t2]) => {
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

function solveBipartite(
  remainingA: Team[],
  availableB: Team[]
): [Team, Team][] | null {
  if (remainingA.length === 0) return [];

  const currentA = remainingA[0];
  const restA = remainingA.slice(1);

  for (let i = 0; i < availableB.length; i++) {
    const candidateB = availableB[i];

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
 * 3. Pair each pool using backtracking with guaranteed deadlock breaker (no infinite loop)
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
      console.warn(`[SwissDraw] Pool ${recordKey} has an odd number of teams: ${poolTeams.length}`);
      continue;
    }

    const pairs = pairPoolWithDeadlockResolution(poolTeams);

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
 * Robust pool pairing:
 * Stage 1: Tries multiple randomized backtracking attempts to find a 100% 0-rematch pairing.
 * Stage 2: If a mathematical deadlock occurs (no zero-rematch pairing exists),
 *          applies an optimal branch-and-bound solver that pairs teams minimizing rematch penalties
 *          (favoring matches played longest ago).
 * Guarantees NO infinite loop, NO browser freeze, and NO uncaught error.
 */
export function pairPoolWithDeadlockResolution(teams: Team[]): [Team, Team][] {
  if (teams.length <= 1) return [];

  // Stage 1: Up to 30 randomized backtracking attempts to find a 0-rematch draw
  const MAX_ATTEMPTS = 30;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const shuffled = shuffle(teams);
    const result = solvePoolZeroRematch(shuffled);
    if (result) return result;
  }

  // Stage 2: Deadlock Breaker via Minimal-Rematch Branch-and-Bound
  // When mathematically impossible without rematches, find the pairing with minimum rematch penalty
  return solvePoolOptimal(teams);
}

/**
 * Fast depth-first search for a 0-rematch pairing
 */
function solvePoolZeroRematch(remaining: Team[]): [Team, Team][] | null {
  if (remaining.length === 0) return [];

  const current = remaining[0];
  const rest = remaining.slice(1);

  // Filter candidates who are not past opponents, randomized
  const candidates = shuffle(
    rest.filter((candidate) => !current.pastOpponents.includes(candidate.id))
  );

  for (const candidate of candidates) {
    const nextRemaining = rest.filter((t) => t.id !== candidate.id);
    const subResult = solvePoolZeroRematch(nextRemaining);
    if (subResult !== null) {
      return [[current, candidate], ...subResult];
    }
  }

  return null;
}

/**
 * Branch-and-bound solver that finds a valid pairing with the absolute minimum rematch cost.
 * For pool size <= 8 (at most 105 total matchings), this evaluates in < 0.1ms.
 */
function solvePoolOptimal(teams: Team[]): [Team, Team][] {
  if (teams.length === 0) return [];

  let bestSolution: [Team, Team][] = [];
  let minPenalty = Infinity;
  let iterations = 0;
  const MAX_ITERATIONS = 5000; // Safeguard against any unbounded execution

  function backtrack(
    remaining: Team[],
    currentPairs: [Team, Team][],
    currentPenalty: number
  ) {
    iterations++;
    if (iterations > MAX_ITERATIONS) return;
    if (currentPenalty >= minPenalty) return; // Prune non-optimal branches

    if (remaining.length === 0) {
      minPenalty = currentPenalty;
      bestSolution = currentPairs;
      return;
    }

    const first = remaining[0];
    const rest = remaining.slice(1);

    // Sort candidates: non-rematches first, then opponents played longest ago
    const sortedRest = [...rest].sort((a, b) => {
      const aRematch = first.pastOpponents.includes(a.id);
      const bRematch = first.pastOpponents.includes(b.id);
      if (aRematch !== bRematch) return aRematch ? 1 : -1;
      // If both are rematches, earlier in pastOpponents means played longer ago (lower penalty)
      const aIdx = first.pastOpponents.indexOf(a.id);
      const bIdx = first.pastOpponents.indexOf(b.id);
      return aIdx - bIdx;
    });

    for (const candidate of sortedRest) {
      const isRematch = first.pastOpponents.includes(candidate.id);
      let penalty = 0;
      if (isRematch) {
        const oppIndex = first.pastOpponents.indexOf(candidate.id);
        penalty = 1000 + (oppIndex + 1);
      }

      const nextRemaining = rest.filter((t) => t.id !== candidate.id);
      backtrack(
        nextRemaining,
        [...currentPairs, [first, candidate]],
        currentPenalty + penalty
      );

      if (minPenalty === 0) return; // Global optimum reached
    }
  }

  backtrack(teams, [], 0);

  if (bestSolution.length > 0) {
    return bestSolution;
  }

  // Ultimate fallback (simple sequential pairing) if all else fails
  const emergencyPairs: [Team, Team][] = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      emergencyPairs.push([teams[i], teams[i + 1]]);
    }
  }
  return emergencyPairs;
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

