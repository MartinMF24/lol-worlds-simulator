import { TeamRatings, RatingWeights } from '../types/ratings';

/**
 * Ponderación competitiva:
 * - 40% Nivel de Equipo (Macro, sincronía y peleas grupales)
 * - 35% Nivel Individual (Micro, mecánicas individuales y fase de líneas)
 * - 25% Nivel Estratégico (Drafts, versatilidad y lectura del meta)
 */
export const DEFAULT_RATING_WEIGHTS: RatingWeights = {
  teamplay: 0.40,
  individual: 0.35,
  strategy: 0.25,
};

/**
 * Calificaciones de los 19 equipos de Worlds 2026 en escala 1 a 100.
 * Ajustables libremente para reflejar power rankings o parches del juego.
 */
export const TEAM_RATINGS: Record<string, TeamRatings> = {
  // LPL (China)
  al: {
    individual: 92,
    teamplay: 93,
    strategy: 91,
  },
  blg: {
    individual: 96,
    teamplay: 95,
    strategy: 93,
  },
  tes: {
    individual: 93,
    teamplay: 90,
    strategy: 89,
  },
  ig: {
    individual: 89,
    teamplay: 85,
    strategy: 85,
  },

  // LCK (Corea)
  gen: {
    individual: 97,
    teamplay: 96,
    strategy: 94,
  },
  hle: {
    individual: 95,
    teamplay: 94,
    strategy: 92,
  },
  t1: {
    individual: 94,
    teamplay: 93,
    strategy: 95,
  },
  dk: {
    individual: 90,
    teamplay: 88,
    strategy: 87,
  },

  // LEC (Europa)
  g2: {
    individual: 88,
    teamplay: 89,
    strategy: 93,
  },
  mkoi: {
    individual: 82,
    teamplay: 85,
    strategy: 85,
  },

  // PCS/VCS (Asia-Pacífico)
  tsw: {
    individual: 81,
    teamplay: 82,
    strategy: 80,
  },
  cfo: {
    individual: 79,
    teamplay: 80,
    strategy: 79,
  },

  // LCS (Norteamérica)
  tl: {
    individual: 84,
    teamplay: 86,
    strategy: 86,
  },
  lyon: {
    individual: 80,
    teamplay: 81,
    strategy: 81,
  },

  // CBLOL (Brasil)
  cblol2: {
    individual: 76,
    teamplay: 78,
    strategy: 77,
  },
  los: {
    individual: 76,
    teamplay: 78,
    strategy: 77,
  },

  // Candidatos de Play-in (Cupo 16)
  kc: {
    individual: 83,
    teamplay: 82,
    strategy: 81,
  },
  mvk: {
    individual: 75,
    teamplay: 77,
    strategy: 76,
  },
  c9: {
    individual: 82,
    teamplay: 81,
    strategy: 80,
  },
  cblol_pi: {
    individual: 74,
    teamplay: 76,
    strategy: 75,
  },
};

/**
 * Obtiene los ratings individuales de un equipo dado.
 */
export function getTeamRatings(teamId: string): TeamRatings {
  const normalized = teamId.toLowerCase();
  return TEAM_RATINGS[normalized] || TEAM_RATINGS[teamId] || {
    individual: 75,
    teamplay: 75,
    strategy: 75,
  };
}

/**
 * Obtiene el rating compuesto ponderado (escala 1 a 100) para un equipo dado.
 */
export function getTeamOverallRating(
  teamId: string,
  weights: RatingWeights = DEFAULT_RATING_WEIGHTS
): number {
  const ratings = getTeamRatings(teamId);

  return (
    ratings.teamplay * weights.teamplay +
    ratings.individual * weights.individual +
    ratings.strategy * weights.strategy
  );
}

