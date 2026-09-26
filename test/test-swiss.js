// Automated simulation test for Swiss Draw rules with dynamic Play-in candidates

const BASE_15_TEAMS = [
  // LPL
  { id: 'al', name: "Anyone's Legend", region: 'LPL', seed: 1 },
  { id: 'blg', name: 'Bilibili Gaming', region: 'LPL', seed: 2 },
  { id: 'tes', name: 'Top Esports', region: 'LPL', seed: 3 },
  { id: 'ig', name: 'Invictus Gaming', region: 'LPL', seed: 4 },
  // LCK
  { id: 'gen', name: 'Gen.G', region: 'LCK', seed: 1 },
  { id: 'hle', name: 'Hanwha Life Esports', region: 'LCK', seed: 2 },
  { id: 't1', name: 'T1', region: 'LCK', seed: 3 },
  { id: 'dk', name: 'Dplus KIA', region: 'LCK', seed: 4 },
  // LEC
  { id: 'g2', name: 'G2 Esports', region: 'LEC', seed: 1 },
  { id: 'mkoi', name: 'Movistar KOI', region: 'LEC', seed: 3 },
  // PCS/VCS
  { id: 'tsw', name: 'Team Secret Whales', region: 'PCS/VCS', seed: 2 },
  { id: 'cfo', name: 'CTBC Flying Oyster', region: 'PCS/VCS', seed: 4 },
  // LCS
  { id: 'lcs1', name: 'NA Team 1', region: 'LCS', seed: 1 },
  { id: 'lcs3', name: 'NA Team 3', region: 'LCS', seed: 3 },
  // CBLOL
  { id: 'cblol2', name: 'Brazil Team 2', region: 'CBLOL', seed: 2 },
];

const PLAY_IN_CANDIDATES = [
  { id: 'kc', name: 'Karmine Corp', region: 'LEC', seed: 4 },
  { id: 'mvk', name: 'MVK Esports', region: 'PCS/VCS', seed: 4 },
  { id: 'lcs_pi', name: 'NA Play-in Team', region: 'LCS', seed: 4 },
  { id: 'cblol_pi', name: 'Brazil Play-in Team', region: 'CBLOL', seed: 4 },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function solveBipartite(remainingA, availableB) {
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

function pairSeedsNoSameRegion(groupA, groupB) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const res = solveBipartite(shuffle(groupA), shuffle(groupB));
    if (res) return res;
  }
  throw new Error('Could not pair seeds without same-region clash');
}

function generateRound1(teams) {
  const s1 = teams.filter(t => t.seed === 1);
  const s4 = teams.filter(t => t.seed === 4);
  const s2 = teams.filter(t => t.seed === 2);
  const s3 = teams.filter(t => t.seed === 3);

  const m1 = pairSeedsNoSameRegion(s1, s4);
  const m2 = pairSeedsNoSameRegion(s2, s3);
  return [...m1, ...m2];
}

function solvePool(remaining) {
  if (remaining.length === 0) return [];
  const current = remaining[0];
  const rest = remaining.slice(1);

  const candidates = shuffle(rest.filter(c => !current.pastOpponents.includes(c.id)));
  for (const candidate of candidates) {
    const nextRest = rest.filter(t => t.id !== candidate.id);
    const sub = solvePool(nextRest);
    if (sub !== null) {
      return [[current, candidate], ...sub];
    }
  }
  return null;
}

function pairPoolNoRematch(teams) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const res = solvePool(shuffle(teams));
    if (res) return res;
  }
  return null;
}

function generateSubsequentRound(teams) {
  const active = teams.filter(t => t.wins < 3 && t.losses < 3);
  const pools = {};
  for (const team of active) {
    const key = `${team.wins}-${team.losses}`;
    if (!pools[key]) pools[key] = [];
    pools[key].push(team);
  }

  const allMatches = [];
  for (const [key, poolTeams] of Object.entries(pools)) {
    if (poolTeams.length % 2 !== 0) {
      throw new Error(`Odd number of teams in pool ${key}: ${poolTeams.length}`);
    }
    const pairs = pairPoolNoRematch(poolTeams);
    if (!pairs) {
      throw new Error(`Failed to pair pool ${key} without rematches!`);
    }
    allMatches.push(...pairs);
  }
  return allMatches;
}

function runFullSimulation(candidate, simIndex) {
  const full16 = [...BASE_15_TEAMS, candidate];
  let teams = full16.map(t => ({
    ...t,
    wins: 0,
    losses: 0,
    pastOpponents: [],
  }));

  for (let round = 1; round <= 5; round++) {
    const active = teams.filter(t => t.wins < 3 && t.losses < 3);
    if (active.length === 0) break;

    const matches = round === 1 ? generateRound1(teams) : generateSubsequentRound(teams);

    // Verify rules
    for (const [t1, t2] of matches) {
      // 1. Check no rematches
      if (t1.pastOpponents.includes(t2.id) || t2.pastOpponents.includes(t1.id)) {
        throw new Error(`REMATCH DETECTED in sim ${simIndex} round ${round}: ${t1.name} vs ${t2.name}`);
      }

      // 2. Check Round 1 region & seed rules
      if (round === 1) {
        if (t1.region === t2.region) {
          throw new Error(`SAME REGION in round 1 with candidate ${candidate.name}: ${t1.name} (${t1.region}) vs ${t2.name} (${t2.region})`);
        }

        // Specific test: If candidate is Karmine Corp (LEC), ensure NEVER plays G2 (LEC)
        if (candidate.id === 'kc') {
          if ((t1.id === 'kc' && t2.id === 'g2') || (t1.id === 'g2' && t2.id === 'kc')) {
            throw new Error(`Karmine Corp played G2 Esports in Round 1!`);
          }
        }

        // Specific test: If candidate is NA Play-in Team (LCS), ensure NEVER plays NA Team 1 (LCS)
        if (candidate.id === 'lcs_pi') {
          if ((t1.id === 'lcs_pi' && t2.id === 'lcs1') || (t1.id === 'lcs1' && t2.id === 'lcs_pi')) {
            throw new Error(`NA Play-in Team played NA Team 1 in Round 1!`);
          }
        }

        const seeds = [t1.seed, t2.seed].sort().join('-');
        if (seeds !== '1-4' && seeds !== '2-3') {
          throw new Error(`INVALID SEED MATCHUP in round 1: ${seeds}`);
        }
      } else {
        // Check same record
        if (t1.wins !== t2.wins || t1.losses !== t2.losses) {
          throw new Error(`MISMATCHED RECORD in round ${round}: ${t1.name} (${t1.wins}-${t1.losses}) vs ${t2.name} (${t2.wins}-${t2.losses})`);
        }
      }
    }

    // Play matches (random winner)
    for (const [t1, t2] of matches) {
      const winner = Math.random() > 0.5 ? t1 : t2;
      const loser = winner === t1 ? t2 : t1;

      const refWinner = teams.find(t => t.id === winner.id);
      const refLoser = teams.find(t => t.id === loser.id);

      refWinner.wins += 1;
      refWinner.pastOpponents.push(refLoser.id);

      refLoser.losses += 1;
      refLoser.pastOpponents.push(refWinner.id);
    }
  }

  const qualified = teams.filter(t => t.wins === 3);
  const eliminated = teams.filter(t => t.losses === 3);

  if (qualified.length !== 8) {
    throw new Error(`Expected 8 qualified teams, got ${qualified.length}`);
  }
  if (eliminated.length !== 8) {
    throw new Error(`Expected 8 eliminated teams, got ${eliminated.length}`);
  }

  return { qualified, eliminated };
}

console.log('🚀 Starting 400 full Swiss Stage simulation tests across all 4 Play-in candidates...');
const startTime = Date.now();

for (const candidate of PLAY_IN_CANDIDATES) {
  for (let i = 1; i <= 100; i++) {
    runFullSimulation(candidate, i);
  }
  console.log(`  ✓ 100 simulations passed for candidate: ${candidate.name} (${candidate.region})`);
}

const elapsed = Date.now() - startTime;
console.log(`✅ All 400 Swiss tournaments PASSED in ${elapsed}ms!`);
console.log('  - Seed 1 vs 4 & Seed 2 vs 3 respected 100%');
console.log('  - 0 same-region matchups in Round 1 (including Karmine Corp vs G2, NA Play-in vs NA Team 1)');
console.log('  - 0 rematches across all rounds');
console.log('  - 100% exact 8 qualified (3-0, 3-1, 3-2) and 8 eliminated (0-3, 1-3, 2-3)');
