import { useState, useCallback, useMemo } from 'react';
import { Team, Match, Round } from '../types/swiss';
import { createInitialTeams, PLAY_IN_CANDIDATES } from '../data/teams';
import { drawSwissRound } from '../utils/swissDraw';
import { REAL_TOURNAMENT_DATA, RealTournamentConfig, RealMatchData } from '../data/tournamentData';
import { predictMatchesBatch } from '../utils/monteCarlo';
import { MatchProbability } from '../types/ratings';

export interface UseSwissSimulationReturn {
  teams: Team[];
  selectedPlayInTeam: Team | null;
  currentRound: number;
  rounds: Round[];
  activeMatches: Match[];
  selectedWinners: Record<string, string>;
  matchProbabilities: Record<string, MatchProbability>;
  isRoundComplete: boolean;
  qualifiedTeams: Team[];
  eliminatedTeams: Team[];
  swissEliminatedTeams: Team[];
  isFinished: boolean;
  isCurrentRoundRealDraw: boolean;
  startSimulation: (playInTeam: Team) => void;
  selectWinner: (matchId: string, winnerId: string) => void;
  confirmRound: () => void;
  rerollRound: () => void;
  resetSimulation: () => void;
  autoPickWinners: () => void;
  autoPickWinnersByProbability: () => void;
}

export interface InitialTournamentState {
  selectedPlayInTeam: Team | null;
  teams: Team[];
  currentRound: number;
  rounds: Round[];
  activeMatches: Match[];
  selectedWinners: Record<string, string>;
  isFinished: boolean;
  isCurrentRoundRealDraw: boolean;
}

/**
 * Maps raw real match data from tournamentData.ts to typed Match objects,
 * resolving play-in candidate aliases dynamically.
 */
function convertRealMatchesToMatches(
  realMatches: RealMatchData[],
  roundNumber: number,
  teamsList: Team[],
  candidate: Team
): Match[] {
  const findTeam = (id: string): Team => {
    // If the match refers to 'play_in' or any Play-In candidate ID, resolve to the active candidate
    if (id === 'play_in' || PLAY_IN_CANDIDATES.some((c) => c.id === id)) {
      const match = teamsList.find((t) => t.id === candidate.id);
      if (match) return match;
    }
    const found = teamsList.find((t) => t.id === id);
    if (!found) {
      console.warn(
        `[convertRealMatchesToMatches] Team ID "${id}" not found, falling back to ${candidate.name}`
      );
      return candidate;
    }
    return found;
  };

  return realMatches.map((m) => {
    const team1 = findTeam(m.team1Id);
    const team2 = findTeam(m.team2Id);
    const poolRecord = `${team1.wins}-${team1.losses}`;
    const isHighMatch = team1.wins === 2;
    const isLowMatch = team1.losses === 2;

    return {
      id: m.id,
      round: roundNumber,
      poolRecord,
      team1,
      team2,
      winnerId: m.winnerId || null,
      isHighMatch,
      isLowMatch,
      scheduledTime: m.scheduledTime,
      isOfficialWinner: !!m.winnerId,
    };
  });
}

/**
 * Computes the tournament state based on the real tournament configuration in src/data/tournamentData.ts.
 * - If playInWinnerId is set, skips play-in selection directly to Swiss stage.
 * - If a round is fully played in real life, loads it as completed and advances to the next round.
 * - If a round has an official real draw, loads its pairings and disables re-rolling.
 */
export function computeInitialTournamentState(
  userChosenPlayIn?: Team | null,
  realConfig: RealTournamentConfig = REAL_TOURNAMENT_DATA
): InitialTournamentState {
  const playInId = realConfig.playInWinnerId;
  const candidate =
    userChosenPlayIn ||
    (playInId ? PLAY_IN_CANDIDATES.find((c) => c.id === playInId) || null : null);

  // If no candidate is configured or chosen, wait for manual play-in selection
  if (!candidate) {
    return {
      selectedPlayInTeam: null,
      teams: [],
      currentRound: 1,
      rounds: [],
      activeMatches: [],
      selectedWinners: {},
      isFinished: false,
      isCurrentRoundRealDraw: false,
    };
  }

  let currentTeams = createInitialTeams(candidate);
  const roundsHistory: Round[] = [];
  let currentRoundNum = 1;
  let activeMatches: Match[] = [];
  const selectedWinners: Record<string, string> = {};
  let isCurrentRoundRealDraw = false;
  let isFinished = false;

  for (let r = 1; r <= 5; r++) {
    const realRound = realConfig.rounds.find((rd) => rd.roundNumber === r);

    if (realRound && realRound.isRealDraw && realRound.matches && realRound.matches.length > 0) {
      const convertedMatches = convertRealMatchesToMatches(
        realRound.matches,
        r,
        currentTeams,
        candidate
      );

      const isRoundFullyPlayed = convertedMatches.every((m) => !!m.winnerId);

      if (isRoundFullyPlayed) {
        // Record results of completed real round
        currentTeams = currentTeams.map((team) => {
          const match = convertedMatches.find(
            (m) => m.team1.id === team.id || m.team2.id === team.id
          );
          if (!match) return team;
          const opponent = match.team1.id === team.id ? match.team2 : match.team1;
          const won = match.winnerId === team.id;
          return {
            ...team,
            wins: won ? team.wins + 1 : team.wins,
            losses: won ? team.losses : team.losses + 1,
            pastOpponents: [...team.pastOpponents, opponent.id],
          };
        });

        roundsHistory.push({
          roundNumber: r,
          matches: convertedMatches,
          isCompleted: true,
          isRealDraw: true,
        });

        const qualified = currentTeams.filter((t) => t.wins >= 3);
        const eliminated = currentTeams.filter((t) => t.losses >= 3);
        if (qualified.length === 8 && eliminated.length === 8) {
          isFinished = true;
          break;
        }

        continue;
      } else {
        // This is the active real round
        currentRoundNum = r;
        activeMatches = convertedMatches;
        isCurrentRoundRealDraw = true;

        convertedMatches.forEach((m) => {
          if (m.winnerId) {
            selectedWinners[m.id] = m.winnerId;
          }
        });

        break;
      }
    } else {
      // Round is not drawn in real life; generate simulated pairings
      currentRoundNum = r;
      isCurrentRoundRealDraw = false;
      activeMatches = drawSwissRound(currentTeams, r);
      break;
    }
  }

  return {
    selectedPlayInTeam: candidate,
    teams: currentTeams,
    currentRound: currentRoundNum,
    rounds: roundsHistory,
    activeMatches,
    selectedWinners,
    isFinished,
    isCurrentRoundRealDraw,
  };
}

export function useSwissSimulation(): UseSwissSimulationReturn {
  const [initialState] = useState(() => computeInitialTournamentState(null));

  const [selectedPlayInTeam, setSelectedPlayInTeam] = useState<Team | null>(
    initialState.selectedPlayInTeam
  );
  const [teams, setTeams] = useState<Team[]>(initialState.teams);
  const [currentRound, setCurrentRound] = useState<number>(initialState.currentRound);
  const [rounds, setRounds] = useState<Round[]>(initialState.rounds);
  const [activeMatches, setActiveMatches] = useState<Match[]>(initialState.activeMatches);
  const [selectedWinners, setSelectedWinners] = useState<Record<string, string>>(
    initialState.selectedWinners
  );
  const [isFinished, setIsFinished] = useState<boolean>(initialState.isFinished);
  const [isCurrentRoundRealDraw, setIsCurrentRoundRealDraw] = useState<boolean>(
    initialState.isCurrentRoundRealDraw
  );

  // Teams with 3 wins
  const qualifiedTeams = useMemo(() => {
    return teams.filter((t) => t.wins >= 3);
  }, [teams]);

  // Play-in eliminated teams (the 3 candidates that did NOT qualify)
  const playInEliminatedTeams = useMemo(() => {
    if (!selectedPlayInTeam) return [];
    return PLAY_IN_CANDIDATES.filter((c) => c.id !== selectedPlayInTeam.id).map((c) => ({
      ...c,
      wins: 0,
      losses: 1,
      pastOpponents: [],
      isPlayInEliminated: true,
    }));
  }, [selectedPlayInTeam]);

  // Teams with 3 losses in Swiss Stage
  const swissEliminatedTeams = useMemo(() => {
    return teams.filter((t) => t.losses >= 3);
  }, [teams]);

  // All eliminated teams ordered as a stack:
  // - Top: Last eliminated in Swiss (Round 5: 2-3, then Round 4: 1-3, then Round 3: 0-3)
  // - Bottom: First eliminated in the tournament (Play-In candidates)
  const eliminatedTeams = useMemo(() => {
    const sortedSwiss = [...swissEliminatedTeams].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.name.localeCompare(b.name);
    });
    return [...sortedSwiss, ...playInEliminatedTeams];
  }, [swissEliminatedTeams, playInEliminatedTeams]);

  // Check if every active match has a selected winner
  const isRoundComplete = useMemo(() => {
    if (activeMatches.length === 0) return false;
    return activeMatches.every((m) => !!selectedWinners[m.id]);
  }, [activeMatches, selectedWinners]);

  // Probabilidades de Monte Carlo (N=1000 con semilla determinista) calculadas para los partidos de la ronda activa
  const matchProbabilities = useMemo(() => {
    if (activeMatches.length === 0) return {};
    return predictMatchesBatch(activeMatches, 1000);
  }, [activeMatches]);

  // Start simulation with chosen Play-in winner (when manual selection is enabled)
  const startSimulation = useCallback((playInTeam: Team) => {
    const state = computeInitialTournamentState(playInTeam);
    setSelectedPlayInTeam(state.selectedPlayInTeam);
    setTeams(state.teams);
    setCurrentRound(state.currentRound);
    setRounds(state.rounds);
    setActiveMatches(state.activeMatches);
    setSelectedWinners(state.selectedWinners);
    setIsFinished(state.isFinished);
    setIsCurrentRoundRealDraw(state.isCurrentRoundRealDraw);
  }, []);

  // Handler to select a winner for a given match with strict validation
  const selectWinner = useCallback((matchId: string, winnerId: string) => {
    setActiveMatches((currentActive) => {
      const targetMatch = currentActive.find((m) => m.id === matchId);
      if (!targetMatch) return currentActive;

      // If this match already has an official result from the real tournament, do not allow overriding
      if (targetMatch.isOfficialWinner) {
        return currentActive;
      }

      // Defensive validation: winner MUST be one of the two competing teams
      if (targetMatch.team1.id !== winnerId && targetMatch.team2.id !== winnerId) {
        console.warn(`[useSwissSimulation] Invalid winnerId: ${winnerId} for match ${matchId}`);
        return currentActive;
      }

      setSelectedWinners((prev) => ({
        ...prev,
        [matchId]: winnerId,
      }));

      return currentActive;
    });
  }, []);

  // Opción 1: Auto-Pick aleatorio clásico (50/50)
  const autoPickWinners = useCallback(() => {
    if (activeMatches.length === 0) return;
    const newWinners: Record<string, string> = { ...selectedWinners };
    activeMatches.forEach((m) => {
      if (!newWinners[m.id]) {
        newWinners[m.id] = Math.random() > 0.5 ? m.team1.id : m.team2.id;
      }
    });
    setSelectedWinners(newWinners);
  }, [activeMatches, selectedWinners]);

  // Opción 2: Auto-Pick por mayor probabilidad (favorito de Monte Carlo)
  const autoPickWinnersByProbability = useCallback(() => {
    if (activeMatches.length === 0) return;
    const newWinners: Record<string, string> = { ...selectedWinners };
    activeMatches.forEach((m) => {
      if (!newWinners[m.id]) {
        const prob = matchProbabilities[m.id];
        if (prob) {
          newWinners[m.id] = prob.team1Prob >= prob.team2Prob ? m.team1.id : m.team2.id;
        } else {
          newWinners[m.id] = m.team1.id;
        }
      }
    });
    setSelectedWinners(newWinners);
  }, [activeMatches, selectedWinners, matchProbabilities]);

  // Confirm current round and progress to next round or finish
  const confirmRound = useCallback(() => {
    if (!isRoundComplete) return;

    try {
      // 1. Mark winners in matches with validation
      const completedMatches: Match[] = activeMatches.map((m) => {
        const winnerId = selectedWinners[m.id];
        const validWinnerId =
          winnerId === m.team1.id || winnerId === m.team2.id ? winnerId : m.team1.id;
        return {
          ...m,
          winnerId: validWinnerId,
        };
      });

      // 2. Update team records and past opponents immutably
      const updatedTeams: Team[] = teams.map((team) => {
        const match = completedMatches.find(
          (m) => m.team1.id === team.id || m.team2.id === team.id
        );
        if (!match) return team;

        const opponent = match.team1.id === team.id ? match.team2 : match.team1;
        const won = match.winnerId === team.id;

        return {
          ...team,
          wins: won ? team.wins + 1 : team.wins,
          losses: won ? team.losses : team.losses + 1,
          pastOpponents: [...team.pastOpponents, opponent.id],
        };
      });

      // 3. Save completed round to history
      const completedRound: Round = {
        roundNumber: currentRound,
        matches: completedMatches,
        isCompleted: true,
        isRealDraw: isCurrentRoundRealDraw,
      };
      const newRounds = [...rounds, completedRound];

      // 4. Check if simulation is complete (8 qualified & 8 eliminated)
      const newQualified = updatedTeams.filter((t) => t.wins >= 3);
      const newEliminated = updatedTeams.filter((t) => t.losses >= 3);

      if ((newQualified.length === 8 && newEliminated.length === 8) || currentRound >= 5) {
        setTeams(updatedTeams);
        setRounds(newRounds);
        setActiveMatches([]);
        setSelectedWinners({});
        setIsFinished(true);
        return;
      }

      // 5. Draw or load next round safely
      const nextRoundNumber = currentRound + 1;
      const nextRealRound = REAL_TOURNAMENT_DATA.rounds.find(
        (rd) => rd.roundNumber === nextRoundNumber
      );

      let nextMatches: Match[];
      let nextIsRealDraw = false;
      const nextWinners: Record<string, string> = {};

      if (
        nextRealRound &&
        nextRealRound.isRealDraw &&
        nextRealRound.matches &&
        nextRealRound.matches.length > 0
      ) {
        nextIsRealDraw = true;
        nextMatches = convertRealMatchesToMatches(
          nextRealRound.matches,
          nextRoundNumber,
          updatedTeams,
          selectedPlayInTeam!
        );

        nextMatches.forEach((m) => {
          if (m.winnerId) {
            nextWinners[m.id] = m.winnerId;
          }
        });
      } else {
        nextIsRealDraw = false;
        nextMatches = drawSwissRound(updatedTeams, nextRoundNumber);
      }

      setTeams(updatedTeams);
      setRounds(newRounds);
      setCurrentRound(nextRoundNumber);
      setActiveMatches(nextMatches);
      setSelectedWinners(nextWinners);
      setIsCurrentRoundRealDraw(nextIsRealDraw);
    } catch (err) {
      console.error('[useSwissSimulation] Error during round confirmation:', err);
    }
  }, [
    activeMatches,
    selectedWinners,
    isRoundComplete,
    teams,
    currentRound,
    rounds,
    isCurrentRoundRealDraw,
    selectedPlayInTeam,
  ]);

  // Re-draw current active round pairings safely (blocked if round is an official real draw)
  const rerollRound = useCallback(() => {
    if (teams.length !== 16 || isFinished) return;
    if (isCurrentRoundRealDraw) {
      console.warn('[useSwissSimulation] Cannot reroll an official real draw.');
      return;
    }
    try {
      const newMatches = drawSwissRound(teams, currentRound);
      setActiveMatches(newMatches);
      setSelectedWinners({});
    } catch (err) {
      console.error('[useSwissSimulation] Error during round reroll:', err);
    }
  }, [teams, currentRound, isFinished, isCurrentRoundRealDraw]);

  // Reset entire tournament
  const resetSimulation = useCallback(() => {
    const initialState = computeInitialTournamentState(null);
    setSelectedPlayInTeam(initialState.selectedPlayInTeam);
    setTeams(initialState.teams);
    setCurrentRound(initialState.currentRound);
    setRounds(initialState.rounds);
    setActiveMatches(initialState.activeMatches);
    setSelectedWinners(initialState.selectedWinners);
    setIsFinished(initialState.isFinished);
    setIsCurrentRoundRealDraw(initialState.isCurrentRoundRealDraw);
  }, []);

  return {
    teams,
    selectedPlayInTeam,
    currentRound,
    rounds,
    activeMatches,
    selectedWinners,
    matchProbabilities,
    isRoundComplete,
    qualifiedTeams,
    eliminatedTeams,
    swissEliminatedTeams,
    isFinished,
    isCurrentRoundRealDraw,
    startSimulation,
    selectWinner,
    confirmRound,
    rerollRound,
    resetSimulation,
    autoPickWinners,
    autoPickWinnersByProbability,
  };
}
