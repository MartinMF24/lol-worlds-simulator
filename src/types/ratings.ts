export interface TeamRatings {
  individual: number; // Nivel individual / Mecánicas / Fase de líneas (1 - 100)
  teamplay: number;   // Nivel de equipo / Coordinación / Peleas en equipo (1 - 100)
  strategy: number;   // Nivel estratégico / Drafts / Adaptabilidad (1 - 100)
}

export interface RatingWeights {
  teamplay: number;   // 0.40 por defecto
  individual: number; // 0.35 por defecto
  strategy: number;   // 0.25 por defecto
}

export interface MatchProbability {
  matchId: string;
  team1Id: string;
  team2Id: string;
  team1Prob: number; // Porcentaje 0 a 100
  team2Prob: number; // Porcentaje 0 a 100
  isBo3: boolean;
  simulationsCount: number; // 100
}

