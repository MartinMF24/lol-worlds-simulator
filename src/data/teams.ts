import { Team } from '../types/swiss';

export const INITIAL_TEAMS: Team[] = [
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

  // Wildcard (Play-in Winner)
  {
    id: 'playin4',
    name: 'Play-in Team 4',
    region: 'Wildcard',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'playin_seed_4',
  },
];

export const createInitialTeams = (): Team[] => {
  return INITIAL_TEAMS.map((t) => ({
    ...t,
    wins: 0,
    losses: 0,
    pastOpponents: [],
  }));
};

