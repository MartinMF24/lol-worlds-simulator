import React from 'react';
import { Match, Round } from '../types/swiss';
import { RecordPoolGroup } from './RecordPoolGroup';
import { MatchCard } from './MatchCard';

interface RoundColumnProps {
  roundNumber: number;
  currentRound: number;
  isFinished: boolean;
  roundData?: Round;
  activeMatches?: Match[];
  selectedWinners: Record<string, string>;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
}

export const RoundColumn: React.FC<RoundColumnProps> = ({
  roundNumber,
  currentRound,
  isFinished,
  roundData,
  activeMatches,
  selectedWinners,
  onSelectWinner,
}) => {
  const isPast = roundNumber < currentRound || (isFinished && roundNumber <= currentRound);
  const isActive = roundNumber === currentRound && !isFinished;
  const isFuture = roundNumber > currentRound;

  const matches: Match[] = isPast
    ? roundData?.matches || []
    : isActive
    ? activeMatches || []
    : [];

  // Group matches by poolRecord
  const poolsMap: Record<string, Match[]> = {};
  matches.forEach((m) => {
    const key = m.poolRecord || '0-0';
    if (!poolsMap[key]) poolsMap[key] = [];
    poolsMap[key].push(m);
  });

  // Sort pool keys so highest wins are at top (e.g., 2-0 -> 1-1 -> 0-2)
  const sortedPoolKeys = Object.keys(poolsMap).sort((a, b) => {
    const [wA, lA] = a.split('-').map(Number);
    const [wB, lB] = b.split('-').map(Number);
    if (wB !== wA) return wB - wA;
    return lA - lB;
  });

  return (
    <div
      className={`w-full min-w-0 flex flex-col rounded-xl border transition-all duration-200 ${
        isActive
          ? 'bg-zinc-900/70 border-zinc-650 ring-1 ring-zinc-500/30 shadow-sm'
          : isPast
          ? 'bg-zinc-950/60 border-zinc-800 opacity-85 hover:opacity-100'
          : 'bg-zinc-950/20 border-dashed border-zinc-850/60 opacity-40'
      }`}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 rounded-t-xl">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-white truncate">
            Ronda {roundNumber}
          </span>
        </div>

        <div>
          {isPast ? (
            <span className="text-[10px] text-zinc-400 font-medium">
              Completada
            </span>
          ) : isActive ? (
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              En juego
            </span>
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
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                selectedWinnerId={selectedWinners[match.id]}
                isReadOnly={isPast}
                onSelectWinner={(winnerId) =>
                  onSelectWinner && onSelectWinner(match.id, winnerId)
                }
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
              />
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
