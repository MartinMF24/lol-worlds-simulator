import React, { memo, useMemo } from 'react';
import { Match, Round } from '../types/swiss';
import { MatchProbability } from '../types/ratings';
import { RecordPoolGroup } from './RecordPoolGroup';
import { MatchCard } from './MatchCard';
import { formatMatchDateHeader } from '../utils/timezone';
import { Dices } from 'lucide-react';

interface RoundColumnProps {
  roundNumber: number;
  currentRound: number;
  isFinished: boolean;
  roundData?: Round;
  activeMatches?: Match[];
  selectedWinners: Record<string, string>;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
  onRerollRound?: () => void;
  timeZone?: string;
  isRealDraw?: boolean;
  probabilitiesMap?: Record<string, MatchProbability>;
}

export const RoundColumn: React.FC<RoundColumnProps> = memo(({
  roundNumber,
  currentRound,
  isFinished,
  roundData,
  activeMatches,
  selectedWinners,
  onSelectWinner,
  onRerollRound,
  timeZone,
  isRealDraw = false,
  probabilitiesMap,
}) => {
  const isPast = roundNumber < currentRound || (isFinished && roundNumber <= currentRound);
  const isActive = roundNumber === currentRound && !isFinished;
  const isFuture = roundNumber > currentRound;

  const matches: Match[] = isPast
    ? roundData?.matches || []
    : isActive
    ? activeMatches || []
    : [];

  // Group matches by poolRecord with memoization
  const { poolsMap, sortedPoolKeys } = useMemo(() => {
    const map: Record<string, Match[]> = {};
    matches.forEach((m) => {
      const key = m.poolRecord || '0-0';
      if (!map[key]) map[key] = [];
      map[key].push(m);
    });

    const keys = Object.keys(map).sort((a, b) => {
      const [wA, lA] = a.split('-').map(Number);
      const [wB, lB] = b.split('-').map(Number);
      if (wB !== wA) return wB - wA;
      return lA - lB;
    });

    return { poolsMap: map, sortedPoolKeys: keys };
  }, [matches]);

  // Check if all scheduled matches share the same date
  const roundDateHeader = useMemo(() => {
    const scheduledMatches = matches.filter((m) => !!m.scheduledTime);
    if (scheduledMatches.length === 0) return null;

    const firstDateHeader = formatMatchDateHeader(scheduledMatches[0].scheduledTime, timeZone);
    const allSameDate = scheduledMatches.every(
      (m) => formatMatchDateHeader(m.scheduledTime, timeZone) === firstDateHeader
    );

    return allSameDate ? firstDateHeader : null;
  }, [matches, timeZone]);

  // Calculate nextScheduledTimeMap for LIVE indicator calculation and sort matches chronologically
  const { sortedMatches, nextScheduledTimeMap } = useMemo(() => {
    const scheduled = [...matches]
      .filter((m) => !!m.scheduledTime)
      .sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime());

    const nextMap: Record<string, string | undefined> = {};
    for (let i = 0; i < scheduled.length; i++) {
      const nextMatch = scheduled[i + 1];
      nextMap[scheduled[i].id] = nextMatch ? nextMatch.scheduledTime : undefined;
    }

    const hasScheduled = matches.some((m) => !!m.scheduledTime);
    const sorted = hasScheduled
      ? [...matches].sort((a, b) => {
          if (a.scheduledTime && b.scheduledTime) {
            return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
          }
          if (a.scheduledTime) return -1;
          if (b.scheduledTime) return 1;
          return 0;
        })
      : matches;

    return { sortedMatches: sorted, nextScheduledTimeMap: nextMap };
  }, [matches]);

  return (
    <div
      id={`swiss-round-${roundNumber}`}
      className={`w-[84vw] max-w-[320px] flex-shrink-0 snap-center md:w-full md:max-w-none md:flex-shrink md:snap-align-none min-w-0 flex flex-col rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-zinc-900/70 border-zinc-650 ring-1 ring-zinc-500/30 shadow-sm'
          : isPast
          ? 'bg-zinc-950/60 border-zinc-800 opacity-85 hover:opacity-100'
          : 'bg-zinc-950/20 border-dashed border-zinc-855/60 opacity-40'
      }`}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 rounded-t-xl">
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="text-xs font-bold text-white truncate">
            Ronda {roundNumber}
          </span>
          {roundDateHeader && (
            <span
              suppressHydrationWarning
              className="text-[10px] text-amber-400/90 font-mono font-medium truncate mt-0.5"
            >
              {roundDateHeader}
            </span>
          )}
        </div>

        <div>
          {isPast ? (
            <span className="text-[10px] text-zinc-400 font-medium">
              Completada
            </span>
          ) : isActive ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {onRerollRound && !isRealDraw && (
                <button
                  type="button"
                  onClick={onRerollRound}
                  title="Volver a sortear los partidos de esta ronda"
                  aria-label="Volver a sortear los partidos de esta ronda"
                  className="p-1 rounded text-zinc-400 hover:text-amber-300 bg-zinc-800/90 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 transition-colors duration-150 cursor-pointer flex items-center justify-center"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}
              {isRealDraw && (
                <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                  Oficial
                </span>
              )}
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                En juego
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-zinc-500 font-normal">
              Pendiente
            </span>
          )}
        </div>
      </div>

      {/* Column Body */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-140px)]">
        {isFuture ? (
          <div className="flex-1 min-h-[220px] flex flex-col items-center justify-center p-4 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              Sorteo pendiente
            </p>
          </div>
        ) : roundNumber === 1 ? (
          <div className="space-y-1.5 w-full">
            {sortedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                selectedWinnerId={selectedWinners[match.id]}
                isReadOnly={isPast}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
                nextScheduledTime={nextScheduledTimeMap[match.id]}
                probability={probabilitiesMap?.[match.id]}
              />
            ))}
          </div>
        ) : (
          sortedPoolKeys.map((poolKey, index) => (
            <React.Fragment key={poolKey}>
              {/* Clean Dividing Line between Pools */}
              {index > 0 && (
                <div className="my-2.5 border-t border-zinc-750" />
              )}

              <RecordPoolGroup
                poolRecord={poolKey}
                matches={poolsMap[poolKey]}
                selectedWinners={selectedWinners}
                isReadOnly={isPast}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
                nextScheduledTimeMap={nextScheduledTimeMap}
                probabilitiesMap={probabilitiesMap}
              />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}, (prev, next) => {
  // If basic round identifiers, timezone or tournament states changed, re-render
  if (
    prev.roundNumber !== next.roundNumber ||
    prev.currentRound !== next.currentRound ||
    prev.isFinished !== next.isFinished ||
    prev.roundData !== next.roundData ||
    prev.timeZone !== next.timeZone ||
    prev.isRealDraw !== next.isRealDraw
  ) {
    return false;
  }

  // If this column is the active round, re-render only if active matches, winners or probabilities changed
  const isActive = next.roundNumber === next.currentRound && !next.isFinished;
  if (isActive) {
    return (
      prev.activeMatches === next.activeMatches &&
      prev.selectedWinners === next.selectedWinners &&
      prev.onSelectWinner === next.onSelectWinner &&
      prev.onRerollRound === next.onRerollRound &&
      prev.probabilitiesMap === next.probabilitiesMap
    );
  }

  // Past and future columns are completely invariant to active match winner toggles
  return true;
});

RoundColumn.displayName = 'RoundColumn';
