import { useState, useCallback, useMemo } from 'react';
import { Team } from '../types/swiss';
import { PlayoffBracket, PlayoffMatch } from '../types/playoffs';
import { generatePlayoffsBracket } from '../utils/playoffsDraw';

export interface UsePlayoffsSimulationReturn {
  bracket: PlayoffBracket | null;
  canReroll: boolean;
  reroll: () => void;
  selectWinner: (matchId: string, winnerId: string) => void;
  resetPlayoffs: () => void;
  initializeBracket: (teams: Team[]) => void;
}

export function usePlayoffsSimulation(qualifiedTeams: Team[]): UsePlayoffsSimulationReturn {
  const [bracket, setBracket] = useState<PlayoffBracket | null>(() => {
    if (qualifiedTeams && qualifiedTeams.length === 8) {
      try {
        return generatePlayoffsBracket(qualifiedTeams);
      } catch (err) {
        console.error('Error al inicializar playoffs:', err);
        return null;
      }
    }
    return null;
  });

  const initializeBracket = useCallback((teams: Team[]) => {
    if (teams && teams.length === 8) {
      setBracket(generatePlayoffsBracket(teams));
    }
  }, []);

  // Can reroll ONLY in quarterfinals before ANY winner is selected
  const canReroll = useMemo(() => {
    if (!bracket) return false;
    return bracket.quarters.every((m) => m.winnerId === null);
  }, [bracket]);

  // Reroll quarterfinals draw
  const reroll = useCallback(() => {
    if (!canReroll || !qualifiedTeams || qualifiedTeams.length !== 8) return;
    setBracket(generatePlayoffsBracket(qualifiedTeams));
  }, [canReroll, qualifiedTeams]);

  // Reset entire playoffs
  const resetPlayoffs = useCallback(() => {
    if (!qualifiedTeams || qualifiedTeams.length !== 8) return;
    setBracket(generatePlayoffsBracket(qualifiedTeams));
  }, [qualifiedTeams]);

  // Select winner for a playoff match with reactive advancement and cascade cleanup
  const selectWinner = useCallback((matchId: string, winnerId: string) => {
    setBracket((prev) => {
      if (!prev) return null;

      // Deep clone bracket to avoid mutating state
      const nextQuarters: PlayoffMatch[] = prev.quarters.map((m) => ({ ...m }));
      const nextSemis: PlayoffMatch[] = prev.semis.map((m) => ({ ...m }));
      const nextFinal: PlayoffMatch = { ...prev.final };
      let nextChampion: Team | null = prev.champion;

      // 1. Check if match is in Quarters
      const qIndex = nextQuarters.findIndex((m) => m.id === matchId);
      if (qIndex !== -1) {
        const qMatch = nextQuarters[qIndex];
        const winningTeam = qMatch.team1?.id === winnerId ? qMatch.team1 : qMatch.team2;
        if (!winningTeam) return prev;

        const prevWinnerId = qMatch.winnerId;
        qMatch.winnerId = winnerId;

        // Advance to Semifinals
        const targetSemiIndex = qMatch.nextMatchId === 'sf-1' ? 0 : 1;
        const targetSemi = nextSemis[targetSemiIndex];

        if (qMatch.nextSlot === 1) {
          targetSemi.team1 = winningTeam;
        } else {
          targetSemi.team2 = winningTeam;
        }

        // Cascade cleanup if previous winner had advanced further
        if (prevWinnerId && prevWinnerId !== winnerId) {
          if (targetSemi.winnerId === prevWinnerId) {
            targetSemi.winnerId = null;
            // Clear final slot
            if (targetSemi.nextSlot === 1) {
              nextFinal.team1 = null;
            } else {
              nextFinal.team2 = null;
            }
            if (nextFinal.winnerId === prevWinnerId) {
              nextFinal.winnerId = null;
              nextChampion = null;
            }
          }
        }

        return {
          quarters: nextQuarters,
          semis: nextSemis,
          final: nextFinal,
          champion: nextChampion,
        };
      }

      // 2. Check if match is in Semifinals
      const sIndex = nextSemis.findIndex((m) => m.id === matchId);
      if (sIndex !== -1) {
        const sMatch = nextSemis[sIndex];
        const winningTeam = sMatch.team1?.id === winnerId ? sMatch.team1 : sMatch.team2;
        if (!winningTeam) return prev;

        const prevWinnerId = sMatch.winnerId;
        sMatch.winnerId = winnerId;

        // Advance to Final
        if (sMatch.nextSlot === 1) {
          nextFinal.team1 = winningTeam;
        } else {
          nextFinal.team2 = winningTeam;
        }

        // Cascade cleanup if previous semi winner had won the final
        if (prevWinnerId && prevWinnerId !== winnerId) {
          if (nextFinal.winnerId === prevWinnerId) {
            nextFinal.winnerId = null;
            nextChampion = null;
          }
        }

        return {
          quarters: nextQuarters,
          semis: nextSemis,
          final: nextFinal,
          champion: nextChampion,
        };
      }

      // 3. Check if match is Final
      if (nextFinal.id === matchId) {
        const winningTeam = nextFinal.team1?.id === winnerId ? nextFinal.team1 : nextFinal.team2;
        if (!winningTeam) return prev;

        nextFinal.winnerId = winnerId;
        nextChampion = winningTeam;

        return {
          quarters: nextQuarters,
          semis: nextSemis,
          final: nextFinal,
          champion: nextChampion,
        };
      }

      return prev;
    });
  }, []);

  return {
    bracket,
    canReroll,
    reroll,
    selectWinner,
    resetPlayoffs,
    initializeBracket,
  };
}

