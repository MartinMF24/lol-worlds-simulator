'use client';

import React, { useEffect } from 'react';
import { Team } from '../../types/swiss';
import { usePlayoffsSimulation } from '../../hooks/usePlayoffsSimulation';
import { PlayoffsBracket } from './PlayoffsBracket';

export interface PlayoffsViewProps {
  qualifiedTeams: Team[];
  isSwissFinished: boolean;
  onBackToSwiss: () => void;
  onChampionChange?: (hasChampion: boolean) => void;
  onResetRegister?: (resetFn: () => void) => void;
}

export const PlayoffsView: React.FC<PlayoffsViewProps> = ({
  qualifiedTeams,
  isSwissFinished,
  onBackToSwiss,
  onChampionChange,
  onResetRegister,
}) => {
  const {
    bracket,
    canReroll,
    reroll,
    selectWinner,
    resetPlayoffs,
    initializeBracket,
  } = usePlayoffsSimulation(qualifiedTeams);

  // Sync playoffs bracket whenever the 8 qualified teams are ready
  useEffect(() => {
    if (isSwissFinished && qualifiedTeams.length === 8) {
      initializeBracket(qualifiedTeams);
    }
  }, [isSwissFinished, qualifiedTeams, initializeBracket]);

  // Notify parent of champion status for Navbar badge
  useEffect(() => {
    onChampionChange?.(!!bracket?.champion);
  }, [bracket?.champion, onChampionChange]);

  // Register reset function so Navbar reset button can invoke it
  useEffect(() => {
    onResetRegister?.(resetPlayoffs);
  }, [resetPlayoffs, onResetRegister]);

  return (
    <div className="w-full min-w-[950px] p-2">
      <PlayoffsBracket
        bracket={bracket}
        canReroll={canReroll}
        onReroll={reroll}
        onSelectWinner={selectWinner}
        onBackToSwiss={onBackToSwiss}
      />
    </div>
  );
};

