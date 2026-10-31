import { useState, useCallback, useMemo } from 'react';
import { Team } from '../types/swiss';
import { PlayoffBracket, PlayoffMatch } from '../types/playoffs';
import { generatePlayoffsBracket, createRealPlayoffsBracket } from '../utils/playoffsDraw';
import { REAL_TOURNAMENT_DATA, RealTournamentConfig } from '../data/tournamentData';

export interface UsePlayoffsSimulationReturn {
  bracket: PlayoffBracket | null;
  canReroll: boolean;
  reroll: () => void;
  selectWinner: (matchId: string, winnerId: string) => void;
  resetPlayoffs: () => void;
  initializeBracket: (teams: Team[]) => void;
}

export function usePlayoffsSimulation(
  qualifiedTeams: Team[],
  realConfig: RealTournamentConfig = REAL_TOURNAMENT_DATA
): UsePlayoffsSimulationReturn {
  const [bracket, setBracket] = useState<PlayoffBracket | null>(() => {
    if (realConfig.playoffs?.isRealDraw) {
      try {
        return createRealPlayoffsBracket(realConfig.playoffs, qualifiedTeams);
      } catch (err) {
        console.error('[usePlayoffsSimulation] Error al inicializar playoffs reales:', err);
        return null;
      }
    }

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
    if (realConfig.playoffs?.isRealDraw) {
      try {
        setBracket(createRealPlayoffsBracket(realConfig.playoffs, teams));
      } catch (err) {
        console.error('[usePlayoffsSimulation] Error initializing real bracket:', err);
      }
      return;
    }

    if (teams && teams.length === 8) {
      try {
        setBracket(generatePlayoffsBracket(teams));
      } catch (err) {
        console.error('[usePlayoffsSimulation] Error initializing bracket:', err);
      }
    }
  }, [realConfig.playoffs]);

  // Can reroll ONLY in quarterfinals before ANY winner is selected AND when it is NOT an official draw
  const canReroll = useMemo(() => {
    if (!bracket) return false;
    if (bracket.isRealDraw) return false;
    return bracket.quarters.every((m) => m.winnerId === null);
  }, [bracket]);

  // Reroll quarterfinals draw (disabled for official draws)
  const reroll = useCallback(() => {
    if (!canReroll || bracket?.isRealDraw || !qualifiedTeams || qualifiedTeams.length !== 8) return;
    try {
      setBracket(generatePlayoffsBracket(qualifiedTeams));
    } catch (err) {
      console.error('[usePlayoffsSimulation] Error rerolling playoffs:', err);
    }
  }, [canReroll, bracket?.isRealDraw, qualifiedTeams]);

  // Reset entire playoffs (restores official draw and official results if real draw)
  const resetPlayoffs = useCallback(() => {
    if (realConfig.playoffs?.isRealDraw) {
      try {
        setBracket(createRealPlayoffsBracket(realConfig.playoffs, qualifiedTeams));
      } catch (err) {
        console.error('[usePlayoffsSimulation] Error resetting real playoffs:', err);
      }
      return;
    }

    if (!qualifiedTeams || qualifiedTeams.length !== 8) return;
    try {
      setBracket(generatePlayoffsBracket(qualifiedTeams));
    } catch (err) {
      console.error('[usePlayoffsSimulation] Error resetting playoffs:', err);
    }
  }, [realConfig.playoffs, qualifiedTeams]);

  // Select winner for a playoff match with reactive advancement and cascade cleanup
  const selectWinner = useCallback((matchId: string, winnerId: string) => {
    if (!winnerId) return;

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
        // Cannot alter officially played matches from tournamentData
        if (qMatch.isOfficialWinner) return prev;

        const winningTeam =
          qMatch.team1?.id === winnerId
            ? qMatch.team1
            : qMatch.team2?.id === winnerId
            ? qMatch.team2
            : null;
        if (!winningTeam) return prev;

        const prevWinnerId = qMatch.winnerId;
        qMatch.winnerId = winnerId;
        qMatch.isOfficialWinner = false;

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
            targetSemi.isOfficialWinner = false;
            // Clear final slot
            if (targetSemi.nextSlot === 1) {
              nextFinal.team1 = null;
            } else {
              nextFinal.team2 = null;
            }
            if (nextFinal.winnerId === prevWinnerId) {
              nextFinal.winnerId = null;
              nextFinal.isOfficialWinner = false;
              nextChampion = null;
            }
          }
        }

        return {
          ...prev,
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
        // Cannot alter officially played matches from tournamentData
        if (sMatch.isOfficialWinner) return prev;

        const winningTeam =
          sMatch.team1?.id === winnerId
            ? sMatch.team1
            : sMatch.team2?.id === winnerId
            ? sMatch.team2
            : null;
        if (!winningTeam) return prev;

        const prevWinnerId = sMatch.winnerId;
        sMatch.winnerId = winnerId;
        sMatch.isOfficialWinner = false;

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
            nextFinal.isOfficialWinner = false;
            nextChampion = null;
          }
        }

        return {
          ...prev,
          quarters: nextQuarters,
          semis: nextSemis,
          final: nextFinal,
          champion: nextChampion,
        };
      }

      // 3. Check if match is Final
      if (nextFinal.id === matchId) {
        // Cannot alter officially played matches from tournamentData
        if (nextFinal.isOfficialWinner) return prev;

        const winningTeam =
          nextFinal.team1?.id === winnerId
            ? nextFinal.team1
            : nextFinal.team2?.id === winnerId
            ? nextFinal.team2
            : null;
        if (!winningTeam) return prev;

        nextFinal.winnerId = winnerId;
        nextFinal.isOfficialWinner = false;
        nextChampion = winningTeam;

        return {
          ...prev,
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
