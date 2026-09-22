'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSwissSimulation } from '../src/hooks/useSwissSimulation';
import { Navbar, ActiveTab } from '../src/components/Navbar';
import { RoundColumn } from '../src/components/RoundColumn';
import { FinalZoneColumn } from '../src/components/FinalZoneColumn';

// Lazy-load Playoffs completely so its code, draw algorithm and components
// are NOT downloaded in the initial bundle until the user accesses Playoffs.
const PlayoffsView = dynamic(
  () => import('../src/components/playoffs/PlayoffsView').then((m) => m.PlayoffsView),
  {
    loading: () => (
      <div className="w-full min-h-[450px] flex flex-col items-center justify-center p-12 text-zinc-500 text-xs">
        <div className="w-5 h-5 border-2 border-zinc-700 border-t-amber-400 rounded-full animate-spin mb-3" />
        <span>Cargando Cuadro de Playoffs...</span>
      </div>
    ),
    ssr: false,
  }
);

export default function WorldsSimulatorPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('swiss');
  const [hasChampion, setHasChampion] = useState(false);
  const playoffsResetRef = useRef<(() => void) | null>(null);

  // Swiss stage state
  const {
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

  const handleResetSwiss = () => {
    setHasChampion(false);
    playoffsResetRef.current = null;
    resetSwissSimulation();
  };

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
        hasChampion={hasChampion}
        onConfirmRound={confirmSwissRound}
        onAutoPick={autoPickSwissWinners}
        onResetSwiss={handleResetSwiss}
        onResetPlayoffs={() => playoffsResetRef.current?.()}
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
          /* Playoffs Stage: Dynamically Loaded via next/dynamic */
          <PlayoffsView
            qualifiedTeams={qualifiedTeams}
            isSwissFinished={isSwissFinished}
            onBackToSwiss={() => setActiveTab('swiss')}
            onChampionChange={setHasChampion}
            onResetRegister={(resetFn) => {
              playoffsResetRef.current = resetFn;
            }}
          />
        )}
      </main>
    </div>
  );
}
