'use client';

import React, { useState, useEffect } from 'react';
import { useSwissSimulation } from '../src/hooks/useSwissSimulation';
import { usePlayoffsSimulation } from '../src/hooks/usePlayoffsSimulation';
import { Navbar, ActiveTab } from '../src/components/Navbar';
import { RoundColumn } from '../src/components/RoundColumn';
import { FinalZoneColumn } from '../src/components/FinalZoneColumn';
import { PlayoffsBracket } from '../src/components/playoffs/PlayoffsBracket';

export default function WorldsSimulatorPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('swiss');

  // Swiss stage state
  const {
    teams,
    currentRound,
    rounds,
    activeMatches,
    selectedWinners,
    isRoundComplete,
    qualifiedTeams,
    eliminatedTeams,
    isFinished: isSwissFinished,
    selectWinner: selectSwissWinner,
    confirmRound: confirmSwissRound,
    resetSimulation: resetSwissSimulation,
    autoPickWinners: autoPickSwissWinners,
  } = useSwissSimulation();

  // Playoffs state
  const {
    bracket: playoffBracket,
    canReroll,
    reroll: rerollPlayoffs,
    selectWinner: selectPlayoffWinner,
    resetPlayoffs,
    initializeBracket,
  } = usePlayoffsSimulation(qualifiedTeams);

  // Sync playoffs bracket whenever the 8 qualified teams are ready
  useEffect(() => {
    if (isSwissFinished && qualifiedTeams.length === 8) {
      initializeBracket(qualifiedTeams);
    }
  }, [isSwissFinished, qualifiedTeams, initializeBracket]);

  const selectedCount = Object.keys(selectedWinners).length;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Top Navbar with Tab Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRound={currentRound}
        totalMatchesInRound={activeMatches.length}
        selectedCount={selectedCount}
        isRoundComplete={isRoundComplete}
        qualifiedCount={qualifiedTeams.length}
        eliminatedCount={eliminatedTeams.length}
        isFinished={isSwissFinished}
        hasChampion={!!playoffBracket?.champion}
        onConfirmRound={confirmSwissRound}
        onAutoPick={autoPickSwissWinners}
        onResetSwiss={resetSwissSimulation}
        onResetPlayoffs={resetPlayoffs}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-5 overflow-x-auto">
        {activeTab === 'swiss' ? (
          /* Swiss Stage: 6 Adaptable Columns */
          <div className="grid grid-cols-6 gap-2.5 lg:gap-3 xl:gap-3.5 w-full min-w-[1020px]">
            {/* Rounds 1 to 5 */}
            {[1, 2, 3, 4, 5].map((roundNum) => {
              const completedRoundData = rounds.find((r) => r.roundNumber === roundNum);

              return (
                <RoundColumn
                  key={roundNum}
                  roundNumber={roundNum}
                  currentRound={currentRound}
                  isFinished={isSwissFinished}
                  roundData={completedRoundData}
                  activeMatches={activeMatches}
                  selectedWinners={selectedWinners}
                  onSelectWinner={selectSwissWinner}
                />
              );
            })}

            {/* Column 6: Clasificados (Top) & Eliminados (Underneath) */}
            <FinalZoneColumn
              qualifiedTeams={qualifiedTeams}
              eliminatedTeams={eliminatedTeams}
            />
          </div>
        ) : (
          /* Playoffs Stage: Single Elimination Bracket */
          <div className="w-full min-w-[950px] p-2">
            <PlayoffsBracket
              bracket={playoffBracket}
              canReroll={canReroll}
              onReroll={rerollPlayoffs}
              onSelectWinner={selectPlayoffWinner}
              onBackToSwiss={() => setActiveTab('swiss')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
