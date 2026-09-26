import { useState, useCallback, useMemo } from 'react';
import { Team, Match, Round } from '../types/swiss';
import { createInitialTeams } from '../data/teams';
import { drawSwissRound } from '../utils/swissDraw';

export interface UseSwissSimulationReturn {
  teams: Team[];
  selectedPlayInTeam: Team | null;
  currentRound: number;
  rounds: Round[];
  activeMatches: Match[];
  selectedWinners: Record<string, string>;
  isRoundComplete: boolean;
  qualifiedTeams: Team[];
  eliminatedTeams: Team[];
  isFinished: boolean;
  startSimulation: (playInTeam: Team) => void;
  selectWinner: (matchId: string, winnerId: string) => void;
  confirmRound: () => void;
  rerollRound: () => void;
  resetSimulation: () => void;
  autoPickWinners: () => void;
}

export function useSwissSimulation(): UseSwissSimulationReturn {
  const [selectedPlayInTeam, setSelectedPlayInTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
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

  // Start simulation with chosen Play-in winner (inserted at position 16)
  const startSimulation = useCallback((playInTeam: Team) => {
    const initial = createInitialTeams(playInTeam);
    const round1Matches = drawSwissRound(initial, 1);
    setSelectedPlayInTeam(playInTeam);
    setTeams(initial);
    setCurrentRound(1);
    setRounds([]);
    setActiveMatches(round1Matches);
    setSelectedWinners({});
    setIsFinished(false);
  }, []);

  // Handler to select a winner for a given match
  const selectWinner = useCallback((matchId: string, winnerId: string) => {
    setSelectedWinners((prev) => {
      return {
        ...prev,
        [matchId]: winnerId,
      };
    });
  }, []);

  // Quick helper to randomly pick winners for all unpicked matches in current round
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

  // Re-draw current active round pairings
  const rerollRound = useCallback(() => {
    if (teams.length !== 16 || isFinished) return;
    const newMatches = drawSwissRound(teams, currentRound);
    setActiveMatches(newMatches);
    setSelectedWinners({});
  }, [teams, currentRound, isFinished]);

  // Reset entire tournament back to play-in selection
  const resetSimulation = useCallback(() => {
    setSelectedPlayInTeam(null);
    setTeams([]);
    setCurrentRound(1);
    setRounds([]);
    setActiveMatches([]);
    setSelectedWinners({});
    setIsFinished(false);
  }, []);

  return {
    teams,
    selectedPlayInTeam,
    currentRound,
    rounds,
    activeMatches,
    selectedWinners,
    isRoundComplete,
    qualifiedTeams,
    eliminatedTeams,
    isFinished,
    startSimulation,
    selectWinner,
    confirmRound,
    rerollRound,
    resetSimulation,
    autoPickWinners,
  };
}
