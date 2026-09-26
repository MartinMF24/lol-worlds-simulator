import { Team } from '../types/swiss';

/**
 * 15 fixed teams confirmed for the main event
 */
export const BASE_15_TEAMS: Team[] = [
  // LPL (China)
  {
    id: 'al',
    name: "Anyone's Legend",
    region: 'LPL',
    seed: 1,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'anyones_legend',
  },
  {
    id: 'blg',
    name: 'Bilibili Gaming',
    region: 'LPL',
    seed: 2,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'bilibili_gaming',
  },
  {
    id: 'tes',
    name: 'Top Esports',
    region: 'LPL',
    seed: 3,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'top_esports',
  },
  {
    id: 'ig',
    name: 'Invictus Gaming',
    region: 'LPL',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'invictus_gaming',
  },

  // LCK (Korea)
  {
    id: 'gen',
    name: 'Gen.G',
    region: 'LCK',
    seed: 1,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'geng',
  },
  {
    id: 'hle',
    name: 'Hanwha Life Esports',
    region: 'LCK',
    seed: 2,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'hanwha_life',
  },
  {
    id: 't1',
    name: 'T1',
    region: 'LCK',
    seed: 3,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 't1',
  },
  {
    id: 'dk',
    name: 'Dplus KIA',
    region: 'LCK',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'dplus_kia',
  },

  // LEC (Europa)
  {
    id: 'g2',
    name: 'G2 Esports',
    region: 'LEC',
    seed: 1,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'g2_esport',
  },
  {
    id: 'mkoi',
    name: 'Movistar KOI',
    region: 'LEC',
    seed: 3,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'movistar_koi',
  },

  // PCS/VCS (Asia-Pacific)
  {
    id: 'tsw',
    name: 'Team Secret Whales',
    region: 'PCS/VCS',
    seed: 2,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'team_secret_whales',
  },
  {
    id: 'cfo',
    name: 'CTBC Flying Oyster',
    region: 'PCS/VCS',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'ctbc_flying_oyster',
  },

  // LCS (NA)
  {
    id: 'lcs1',
    name: 'NA Team 1',
    region: 'LCS',
    seed: 1,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'lcs_seed_1',
  },
  {
    id: 'lcs3',
    name: 'NA Team 3',
    region: 'LCS',
    seed: 3,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'lcs_seed_3',
  },

  // CBLOL (Brazil)
  {
    id: 'cblol2',
    name: 'Brazil Team 2',
    region: 'CBLOL',
    seed: 2,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'cblol_seed_2',
  },
];

/**
 * 4 Play-in candidates competing for slot 16 (Seed 4)
 */
export const PLAY_IN_CANDIDATES: Team[] = [
  {
    id: 'kc',
    name: 'Karmine Corp',
    region: 'LEC',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'Karmine_Corp',
  },
  {
    id: 'mvk',
    name: 'MVK Esports',
    region: 'PCS/VCS',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'MVK_Esport',
  },
  {
    id: 'lcs_pi',
    name: 'NA Play-in Team',
    region: 'LCS',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'LCS_play_in',
  },
  {
    id: 'cblol_pi',
    name: 'Brazil Play-in Team',
    region: 'CBLOL',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'CBLOL_play_in',
  },
];

/**
 * Legacy 16-teams array (uses default first candidate as fallback)
 */
export const INITIAL_TEAMS: Team[] = [
  ...BASE_15_TEAMS,
  PLAY_IN_CANDIDATES[0],
];

/**
 * Creates a clean 16-team array with the selected Play-in candidate in position 16.
 */
export const createInitialTeams = (playInCandidate?: Team): Team[] => {
  const candidate = playInCandidate || PLAY_IN_CANDIDATES[0];
  const full16 = [...BASE_15_TEAMS, candidate];

  return full16.map((t) => ({
    ...t,
    wins: 0,
    losses: 0,
    pastOpponents: [],
  }));
};
