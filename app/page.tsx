'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSwissSimulation } from '../src/hooks/useSwissSimulation';
import { Navbar, ActiveTab } from '../src/components/Navbar';
import { RoundColumn } from '../src/components/RoundColumn';
import { FinalZoneColumn } from '../src/components/FinalZoneColumn';
import { PlayInSelection } from '../src/components/PlayInSelection';
import { SplashScreen } from '../src/components/SplashScreen';
import { Team } from '../src/types/swiss';

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
  const [isPreparing, setIsPreparing] = useState(false);
  const playoffsResetRef = useRef<(() => void) | null>(null);

  // Swiss stage state
  const {
    selectedPlayInTeam,
    currentRound,
    rounds,
    activeMatches,
    selectedWinners,
    isRoundComplete,
    qualifiedTeams,
    eliminatedTeams,
    isFinished: isSwissFinished,
    startSimulation,
    selectWinner: selectSwissWinner,
    confirmRound: confirmSwissRound,
    rerollRound: rerollSwissRound,
    resetSimulation: resetSwissSimulation,
    autoPickWinners: autoPickSwissWinners,
  } = useSwissSimulation();

  const handleSelectPlayIn = (team: Team) => {
    setIsPreparing(true);
    setTimeout(() => {
      startSimulation(team);
      setIsPreparing(false);
    }, 450);
  };

  const handleResetTournament = () => {
    setIsPreparing(false);
    setHasChampion(false);
    playoffsResetRef.current = null;
    setActiveTab('swiss');
    resetSwissSimulation();
  };

  const selectedCount = Object.keys(selectedWinners).length;
  const isPlayInSelected = !!selectedPlayInTeam && !isPreparing;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Top Navbar with Tab Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isPlayInSelected={isPlayInSelected}
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
        onResetSwiss={handleResetTournament}
        onResetPlayoffs={() => playoffsResetRef.current?.()}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-5 overflow-x-auto flex flex-col">
        {isPreparing ? (
          /* Splash screen while preparing Round 1 draw */
          <SplashScreen message="Preparando sorteo de Ronda 1..." />
        ) : !selectedPlayInTeam ? (
          /* Step 1: Initial Play-in Selection View */
          <PlayInSelection onSelectTeam={handleSelectPlayIn} />
        ) : activeTab === 'swiss' ? (
          /* Step 2: Swiss Stage 6 Adaptable Columns */
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
                  onRerollRound={rerollSwissRound}
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
          /* Step 3: Playoffs Stage Dynamically Loaded */
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
