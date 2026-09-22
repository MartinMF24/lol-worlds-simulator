import { useState, useCallback, useMemo } from 'react';
import { Team, Match, Round } from '../types/swiss';
import { createInitialTeams } from '../data/teams';
import { drawSwissRound } from '../utils/swissDraw';

export interface UseSwissSimulationReturn {
  teams: Team[];
  currentRound: number;
  rounds: Round[];
  activeMatches: Match[];
  selectedWinners: Record<string, string>;
  isRoundComplete: boolean;
  qualifiedTeams: Team[];
  eliminatedTeams: Team[];
  isFinished: boolean;
  selectWinner: (matchId: string, winnerId: string) => void;
  confirmRound: () => void;
  resetSimulation: () => void;
  autoPickWinners: () => void;
}

export function useSwissSimulation(): UseSwissSimulationReturn {
  const [teams, setTeams] = useState<Team[]>(() => createInitialTeams());
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeMatches, setActiveMatches] = useState<Match[]>(() => {
    const initial = createInitialTeams();
    return drawSwissRound(initial, 1);
  });
  const [selectedWinners, setSelectedWinners] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Teams with 3 wins
  const qualifiedTeams = useMemo(() => {
    return teams.filter((t) => t.wins >= 3);
  }, [teams]);

  // Teams with 3 losses
  const eliminatedTeams = useMemo(() => {
    return teams.filter((t) => t.losses >= 3);
  }, [teams]);

  // Check if every active match has a selected winner
  const isRoundComplete = useMemo(() => {
    if (activeMatches.length === 0) return false;
    return activeMatches.every((m) => !!selectedWinners[m.id]);
  }, [activeMatches, selectedWinners]);

  // Handler to select a winner for a given match
  const selectWinner = useCallback((matchId: string, winnerId: string) => {
    setSelectedWinners((prev) => {
      // Toggle or set
      return {
        ...prev,
        [matchId]: winnerId,
      };
    });
  }, []);

  // Quick helper to randomly pick winners for all unpicked matches in current round
  const autoPickWinners = useCallback(() => {
    const newWinners: Record<string, string> = { ...selectedWinners };
    activeMatches.forEach((m) => {
      if (!newWinners[m.id]) {
        newWinners[m.id] = Math.random() > 0.5 ? m.team1.id : m.team2.id;
      }
    });
    setSelectedWinners(newWinners);
  }, [activeMatches, selectedWinners]);

  // Confirm current round and progress to next round or finish
  const confirmRound = useCallback(() => {
    if (!isRoundComplete) return;

    // 1. Mark winners in matches
    const completedMatches: Match[] = activeMatches.map((m) => ({
      ...m,
      winnerId: selectedWinners[m.id],
    }));

    // 2. Update team records and past opponents immutably
    const updatedTeams: Team[] = teams.map((team) => {
      // Find the match this team played in
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
    };
    const newRounds = [...rounds, completedRound];

    // 4. Check if simulation is complete (8 qualified & 8 eliminated)
    const newQualified = updatedTeams.filter((t) => t.wins >= 3);
    const newEliminated = updatedTeams.filter((t) => t.losses >= 3);

    if (newQualified.length === 8 && newEliminated.length === 8) {
      setTeams(updatedTeams);
      setRounds(newRounds);
      setActiveMatches([]);
      setSelectedWinners({});
      setIsFinished(true);
      return;
    }

    if (currentRound >= 5) {
      setTeams(updatedTeams);
      setRounds(newRounds);
      setActiveMatches([]);
      setSelectedWinners({});
      setIsFinished(true);
      return;
    }

    // 5. Draw next round
    const nextRoundNumber = currentRound + 1;
    const nextMatches = drawSwissRound(updatedTeams, nextRoundNumber);

    setTeams(updatedTeams);
    setRounds(newRounds);
    setCurrentRound(nextRoundNumber);
    setActiveMatches(nextMatches);
    setSelectedWinners({});
  }, [activeMatches, selectedWinners, isRoundComplete, teams, currentRound, rounds]);

  // Reset entire tournament
  const resetSimulation = useCallback(() => {
    const freshTeams = createInitialTeams();
    const firstRoundMatches = drawSwissRound(freshTeams, 1);
    setTeams(freshTeams);
    setCurrentRound(1);
    setRounds([]);
    setActiveMatches(firstRoundMatches);
    setSelectedWinners({});
    setIsFinished(false);
  }, []);

  return {
    teams,
    currentRound,
    rounds,
    activeMatches,
    selectedWinners,
    isRoundComplete,
    qualifiedTeams,
    eliminatedTeams,
    isFinished,
    selectWinner,
    confirmRound,
    resetSimulation,
    autoPickWinners,
  };
}

