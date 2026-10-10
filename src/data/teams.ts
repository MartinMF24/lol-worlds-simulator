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
    roster: {
      top: 'Breathe',
      jungle: 'Tarzan',
      mid: 'Shanks',
      bot: 'Hope',
      support: 'Kael',
    },
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
    roster: {
      top: 'Bin / Flandre',
      jungle: 'Xun',
      mid: 'Knight',
      bot: 'Viper',
      support: 'ON',
    },
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
    roster: {
      top: '369',
      jungle: 'Tian / Zuian',
      mid: 'Creme',
      bot: 'JackeyLove',
      support: 'Zhuo',
    },
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
    roster: {
      top: 'TheShy',
      jungle: 'Wei',
      mid: 'Rookie',
      bot: 'Assum / JiaQi',
      support: 'Meiko',
    },
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
    roster: {
      top: 'Kiin',
      jungle: 'Canyon',
      mid: 'Chovy',
      bot: 'Ruler',
      support: 'Duro',
    },
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
    roster: {
      top: 'Zeus',
      jungle: 'Kanavi',
      mid: 'Zeka',
      bot: 'Gumayusi',
      support: 'Delight',
    },
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
    roster: {
      top: 'Doran',
      jungle: 'Oner',
      mid: 'Faker',
      bot: 'Peyz',
      support: 'Keria',
    },
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
    roster: {
      top: 'Siwoo',
      jungle: 'Lucid',
      mid: 'ShowMaker',
      bot: 'Smash',
      support: 'Career',
    },
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
    roster: {
      top: 'BrokenBlade',
      jungle: 'SkewMond',
      mid: 'Caps',
      bot: 'Hans Sama',
      support: 'Labrov',
    },
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
    roster: {
      top: 'Myrwn',
      jungle: 'Elyoya',
      mid: 'Jojopyun',
      bot: 'Supa',
      support: 'Alvaro',
    },
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
    roster: {
      top: 'Pun',
      jungle: 'Hizto',
      mid: 'Dire',
      bot: 'Eddie',
      support: 'Bie',
    },
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
    roster: {
      top: 'Rest',
      jungle: 'Shad0w',
      mid: 'Pout',
      bot: 'Doggo',
      support: 'Kino',
    },
  },

  // LCS (NA)
  {
    id: 'tl',
    name: 'Team Liquid',
    region: 'LCS',
    seed: 1,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'team_liquid',
    roster: {
      top: 'Morgan',
      jungle: 'Josedeodo',
      mid: 'Quid',
      bot: 'Yeon',
      support: 'CoreJJ',
    },
  },
  {
    id: 'lyon',
    name: 'Lyon',
    region: 'LCS',
    seed: 3,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'lyon',
    roster: {
      top: 'Dhokla / Castle',
      jungle: 'Inspired',
      mid: 'Saint',
      bot: 'Berserker',
      support: 'Isles',
    },
  },

  // CBLOL (Brazil)
  {
    id: 'cblol2',
    name: 'Los Grandes',
    region: 'CBLOL',
    seed: 2,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'los_grandes',
        roster: {
      top: 'Zest',
      jungle: 'Curse',
      mid: 'Feisty',
      bot: 'Duduhh',
      support: 'Ackerman',
    },
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
    roster: {
      top: 'Canna',
      jungle: 'Yike',
      mid: 'kyeahoo',
      bot: 'Caliste',
      support: 'Busio',
    },
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
    roster: {
      top: 'Kratos',
      jungle: 'Gury / SanSan',
      mid: 'Chika',
      bot: 'Harky',
      support: 'SiuLoong',
    },
  },
  {
    id: 'c9',
    name: 'Cloud9',
    region: 'LCS',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'cloud9',
    roster: {
      top: 'Thanatos',
      jungle: 'Blaber',
      mid: 'APA / Loki',
      bot: 'Tactical / Zven',
      support: 'Vulcan',
    },
  },
  {
    id: 'cblol_pi',
    name: 'Furia',
    region: 'CBLOL',
    seed: 4,
    wins: 0,
    losses: 0,
    pastOpponents: [],
    imageKey: 'Furia',
    roster: {
      top: 'Guigo',
      jungle: 'Tatu',
      mid: 'Tutsz',
      bot: 'Ayu',
      support: 'JoJo',
    },
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
