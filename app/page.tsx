'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { REAL_TOURNAMENT_DATA } from '../src/data/tournamentData';

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
  const isPlayoffsRealDraw = !!REAL_TOURNAMENT_DATA.playoffs?.isRealDraw;

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return isPlayoffsRealDraw ? 'playoffs' : 'swiss';
  });
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
    matchProbabilities,
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
    autoPickWinnersByProbability,
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
    setActiveTab(isPlayoffsRealDraw ? 'playoffs' : 'swiss');
    resetSwissSimulation();
  };

  const scrollToColumn = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  // Auto-scroll mobile view to current round when round advances
  useEffect(() => {
    if (isMounted && activeTab === 'swiss' && selectedPlayInTeam) {
      const targetId = isSwissFinished ? 'swiss-final-zone' : `swiss-round-${currentRound}`;
      scrollToColumn(targetId);
    }
  }, [currentRound, isSwissFinished, activeTab, selectedPlayInTeam, isMounted, scrollToColumn]);

  const selectedCount = Object.keys(selectedWinners).length;
  const isPlayInSelected = !!selectedPlayInTeam && !isPreparing;

  // Prevent React Hydration mismatch between server-rendered HTML and client VDOM
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isPlayInSelected={isPlayoffsRealDraw || false}
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
          isPlayoffsRealDraw={isPlayoffsRealDraw}
        />
        <main className="flex-1 w-full max-w-[1920px] mx-auto p-2.5 sm:p-4 lg:p-5 flex items-center justify-center">
          <SplashScreen message={isPlayoffsRealDraw ? 'Iniciando Playoffs...' : 'Iniciando simulador...'} />
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
        onAutoPickByProbability={autoPickWinnersByProbability}
        isPlayoffsRealDraw={isPlayoffsRealDraw}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-2.5 sm:p-4 lg:p-5 overflow-x-auto flex flex-col">
        <ErrorBoundary onReset={handleResetTournament}>
          {isPreparing ? (
            /* Splash screen while preparing Round 1 draw */
            <SplashScreen message="Preparando sorteo de Ronda 1..." />
          ) : activeTab === 'playoffs' ? (
            /* Step 3: Playoffs Stage Dynamically Loaded */
            <PlayoffsView
              qualifiedTeams={qualifiedTeams}
              isSwissFinished={isSwissFinished}
              onBackToSwiss={() => setActiveTab('swiss')}
              onChampionChange={setHasChampion}
              onResetRegister={(resetFn) => {
                playoffsResetRef.current = resetFn;
              }}
              timeZone={TIMEZONE_OPTIONS[selectedTimezone].timeZone}
            />
          ) : !selectedPlayInTeam ? (
            /* Step 1: Initial Play-in Selection View */
            <PlayInSelection onSelectTeam={handleSelectPlayIn} />
          ) : (
            /* Step 2: Swiss Stage 6 Adaptable Columns */
            <div className="flex flex-col w-full">
              {/* Mobile Quick-Jump Round Navigation */}
              <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-2 select-none">
                {[1, 2, 3, 4, 5].map((roundNum) => {
                  const isCurrent = roundNum === currentRound && !isSwissFinished;
                  const isPast = roundNum < currentRound || isSwissFinished;
                  return (
                    <button
                      key={roundNum}
                      type="button"
                      onClick={() => scrollToColumn(`swiss-round-${roundNum}`)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'bg-amber-400 text-zinc-950 shadow-sm'
                          : isPast
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                          : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800/80 hover:text-zinc-400'
                      }`}
                    >
                      Ronda {roundNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => scrollToColumn('swiss-final-zone')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSwissFinished
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  Finales
                </button>
              </div>

              {/* Columns Container: Snap-scrollable carousel on mobile, 6-col grid on desktop */}
              <div className="flex md:grid md:grid-cols-6 gap-3 lg:gap-3 xl:gap-3.5 w-full md:min-w-[1020px] overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0">
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
                      probabilitiesMap={roundNum === currentRound ? matchProbabilities : undefined}
                    />
                  );
                })}

                {/* Column 6: Clasificados (Top) & Eliminados (Underneath) */}
                <FinalZoneColumn
                  qualifiedTeams={qualifiedTeams}
                  eliminatedTeams={eliminatedTeams}
                />
              </div>
            </div>
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
