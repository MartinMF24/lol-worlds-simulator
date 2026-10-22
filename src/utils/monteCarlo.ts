import { MatchProbability, RatingWeights } from '../types/ratings';
import { getTeamOverallRating, DEFAULT_RATING_WEIGHTS } from '../data/teamRatings';

/**
 * Función hash FNV-1a para convertir un string (matchId + equipos + formato) en una semilla numérica de 32 bits.
 */
function hashStringToSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Generador pseudoaleatorio determinista Mulberry32 basado en semilla (Seed).
 * Produce números uniformemente distribuidos en [0, 1) idénticos en cada ejecución con la misma semilla.
 */
function createMulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generador de números aleatorios con distribución Gaussiana / Normal (Media 0, Desviación Estándar stdDev)
 * utilizando el algoritmo Box-Muller sobre el generador con semilla `rng`.
 */
function randomGaussian(rng: () => number, mean = 0, stdDev = 2.5): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdDev;
}

/**
 * Calcula la probabilidad de que el Equipo 1 gane un mapa individual
 * basado en sus rendimientos comparativos usando un modelo logístico (Bradley-Terry).
 */
function calculateMapWinProbability(perf1: number, perf2: number): number {
  // Factor de escala 30: una diferencia de 10 puntos de rating representa ~68% vs 32%
  const scale = 30;
  return 1 / (1 + Math.pow(10, (perf2 - perf1) / scale));
}

/**
 * Simula una serie al mejor de 3 (Bo3) entre dos equipos usando el PRNG determinista `rng`.
 * Gana el primero en alcanzar 2 victorias.
 */
function simulateBo3(rng: () => number, mapWinProb: number): boolean {
  let wins1 = 0;
  let wins2 = 0;

  while (wins1 < 2 && wins2 < 2) {
    if (rng() < mapWinProb) {
      wins1++;
    } else {
      wins2++;
    }
  }

  return wins1 === 2;
}

/**
 * Predice la probabilidad de victoria para un partido ejecutando N simulaciones de Monte Carlo
 * con una semilla determinista para garantizar que el resultado no fluctúe entre recargas.
 *
 * @param matchId ID del partido
 * @param team1Id ID del equipo 1
 * @param team2Id ID del equipo 2
 * @param isBo3 true si es serie al mejor de 3 (clasificación o eliminación), false si es Bo1
 * @param nSimulations Número de iteraciones de Monte Carlo (1000 por defecto)
 * @param weights Ponderaciones opcionales para los ratings
 */
export function predictMatchProbability(
  matchId: string,
  team1Id: string,
  team2Id: string,
  isBo3: boolean,
  nSimulations = 1000,
  weights: RatingWeights = DEFAULT_RATING_WEIGHTS
): MatchProbability {
  const baseRating1 = getTeamOverallRating(team1Id, weights);
  const baseRating2 = getTeamOverallRating(team2Id, weights);

  // Semilla fija única por partido para estabilidad absoluta entre recargas
  const seedString = `match:${matchId}-t1:${team1Id}-t2:${team2Id}-fmt:${isBo3 ? 'bo3' : 'bo1'}`;
  const seed = hashStringToSeed(seedString);
  const rng = createMulberry32(seed);

  let team1Wins = 0;

  for (let i = 0; i < nSimulations; i++) {
    // Perturbación gaussiana reproducible con semilla
    const perf1 = baseRating1 + randomGaussian(rng, 0, 2.5);
    const perf2 = baseRating2 + randomGaussian(rng, 0, 2.5);

    const mapProb = calculateMapWinProbability(perf1, perf2);

    let matchWon = false;
    if (isBo3) {
      matchWon = simulateBo3(rng, mapProb);
    } else {
      // Bo1: se juega 1 sola partida con el PRNG reproducible
      matchWon = rng() < mapProb;
    }

    if (matchWon) {
      team1Wins++;
    }
  }

  // Calculamos el porcentaje, acotado entre 5% y 95% para evitar absolutos en esports
  let rawProb1 = Math.round((team1Wins / nSimulations) * 100);
  rawProb1 = Math.max(5, Math.min(95, rawProb1));
  const rawProb2 = 100 - rawProb1;

  return {
    matchId,
    team1Id,
    team2Id,
    team1Prob: rawProb1,
    team2Prob: rawProb2,
    isBo3,
    simulationsCount: nSimulations,
  };
}

/**
 * Predice las probabilidades para una lista completa de partidos (1000 simulaciones por partido).
 */
export function predictMatchesBatch(
  matches: Array<{ id: string; team1: { id: string }; team2: { id: string }; isHighMatch?: boolean; isLowMatch?: boolean }>,
  nSimulations = 1000
): Record<string, MatchProbability> {
  const result: Record<string, MatchProbability> = {};

  for (const m of matches) {
    const isBo3 = !!(m.isHighMatch || m.isLowMatch);
    result[m.id] = predictMatchProbability(
      m.id,
      m.team1.id,
      m.team2.id,
      isBo3,
      nSimulations
    );
  }

  return result;
}
