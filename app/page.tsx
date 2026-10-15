'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSwissSimulation } from '../src/hooks/useSwissSimulation';
import { Navbar, ActiveTab } from '../src/components/Navbar';
import { RoundColumn } from '../src/components/RoundColumn';
import { FinalZoneColumn } from '../src/components/FinalZoneColumn';
import { PlayInSelection } from '../src/components/PlayInSelection';
import { SplashScreen } from '../src/components/SplashScreen';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Team } from '../src/types/swiss';
import { TimezoneSelector } from '../src/components/TimezoneSelector';
import { TIMEZONE_OPTIONS, TimezoneOption } from '../src/types/timezone';

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
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneOption>('ART');
  const [isMounted, setIsMounted] = useState(false);
  const playoffsResetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    swissEliminatedTeams,
    isFinished: isSwissFinished,
    isCurrentRoundRealDraw,
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

  // Prevent React Hydration mismatch between server-rendered HTML and client VDOM
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isPlayInSelected={false}
          currentRound={1}
          totalMatchesInRound={0}
          selectedCount={0}
          isRoundComplete={false}
          qualifiedCount={0}
          eliminatedCount={0}
          isFinished={false}
          hasChampion={false}
          onConfirmRound={() => {}}
          onAutoPick={() => {}}
          onResetSwiss={() => {}}
          onResetPlayoffs={() => {}}
        />
        <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-5 flex items-center justify-center">
          <SplashScreen message="Iniciando simulador..." />
        </main>
      </div>
    );
  }

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
        eliminatedCount={swissEliminatedTeams.length}
        isFinished={isSwissFinished}
        hasChampion={hasChampion}
        onConfirmRound={confirmSwissRound}
        onAutoPick={autoPickSwissWinners}
        onResetSwiss={handleResetTournament}
        onResetPlayoffs={() => playoffsResetRef.current?.()}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 sm:p-5 overflow-x-auto flex flex-col">
        <ErrorBoundary onReset={handleResetTournament}>
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
                const isRoundRealDraw =
                  roundNum === currentRound
                    ? isCurrentRoundRealDraw
                    : completedRoundData?.isRealDraw ?? false;

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
                    onRerollRound={isRoundRealDraw ? undefined : rerollSwissRound}
                    timeZone={TIMEZONE_OPTIONS[selectedTimezone].timeZone}
                    isRealDraw={isRoundRealDraw}
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
        </ErrorBoundary>
      </main>

      {/* Floating Minimalist Timezone Selector */}
      <TimezoneSelector
        selectedTimezone={selectedTimezone}
        onSelectTimezone={setSelectedTimezone}
      />
    </div>
  );
}
