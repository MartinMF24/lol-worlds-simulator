import React, { memo } from 'react';
import { Match } from '../types/swiss';
import { MatchProbability } from '../types/ratings';
import { MatchCard } from './MatchCard';
import {
  formatMatchDateHeader,
  getMatchDateKey,
} from '../utils/timezone';

interface RecordPoolGroupProps {
  poolRecord: string;
  matches: Match[];
  selectedWinners: Record<string, string>;
  isReadOnly?: boolean;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
  timeZone?: string;
  nextScheduledTimeMap?: Record<string, string | undefined>;
  probabilitiesMap?: Record<string, MatchProbability>;
}

export const RecordPoolGroup: React.FC<RecordPoolGroupProps> = memo(({
  poolRecord,
  matches,
  selectedWinners,
  isReadOnly = false,
  onSelectWinner,
  timeZone,
  nextScheduledTimeMap,
  probabilitiesMap,
}) => {
  const sortedMatches = React.useMemo(() => {
    const hasScheduled = matches.some((m) => !!m.scheduledTime);
    if (!hasScheduled) return matches;
    return [...matches].sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) {
        return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
      }
      if (a.scheduledTime) return -1;
      if (b.scheduledTime) return 1;
      return 0;
    });
  }, [matches]);

  const uniqueDateKeys = React.useMemo(() => {
    const keys = new Set<string>();
    sortedMatches.forEach((m) => {
      const k = getMatchDateKey(m.scheduledTime, timeZone);
      if (k) keys.add(k);
    });
    return Array.from(keys);
  }, [sortedMatches, timeZone]);

  const hasMultipleDates = uniqueDateKeys.length > 1;
  const hasSingleDate = uniqueDateKeys.length === 1;

  // Single date for pool header badge when all matches in the pool are on the same day
  const poolDateHeader = React.useMemo(() => {
    if (!hasSingleDate) return null;
    return formatMatchDateHeader(sortedMatches[0]?.scheduledTime, timeZone);
  }, [hasSingleDate, sortedMatches, timeZone]);

  const [wins, losses] = poolRecord.split('-').map(Number);
  const isAdvancement = wins === 2 && losses < 2;
  const isElimination = losses === 2 && wins < 2;
  const isDecisive = wins === 2 && losses === 2;

  let contextText = '';
  let badgeStyle = 'bg-zinc-800/80 border-zinc-700 text-zinc-200';

  if (isAdvancement) {
    contextText = 'Pase a Playoffs';
    badgeStyle = 'bg-amber-400/10 border-amber-500/30 text-amber-300';
  } else if (isElimination) {
    contextText = 'Eliminación';
    badgeStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-300';
  } else if (isDecisive) {
    contextText = 'Decisivo';
    badgeStyle = 'bg-purple-500/10 border-purple-500/30 text-purple-300';
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Pool Header Badge */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex-shrink-0 ${badgeStyle}`}
          >
            Pool {poolRecord}
          </span>
          {contextText && (
            <span className="text-[10px] text-zinc-400 font-medium truncate">
              {contextText}
            </span>
          )}
        </div>
        {hasSingleDate && poolDateHeader && (
          <span
            suppressHydrationWarning
            className="text-[10px] text-zinc-400 font-mono font-medium flex-shrink-0"
          >
            {poolDateHeader}
          </span>
        )}
      </div>

      {/* Match Cards List with day dividers aligned to the right */}
      <div className="space-y-1.5 w-full">
        {sortedMatches.map((match, idx) => {
          const currentDateKey = getMatchDateKey(match.scheduledTime, timeZone);
          const prevDateKey =
            idx > 0 ? getMatchDateKey(sortedMatches[idx - 1].scheduledTime, timeZone) : null;

          // If pool spans multiple dates, show divider before the 1st match and whenever the date changes
          const showDayDivider =
            (hasMultipleDates && idx === 0 && !!currentDateKey) ||
            (!!prevDateKey && !!currentDateKey && currentDateKey !== prevDateKey);

          const dayLabel = showDayDivider
            ? formatMatchDateHeader(match.scheduledTime, timeZone)
            : null;

          return (
            <React.Fragment key={match.id}>
              {showDayDivider && (
                <div className="flex items-center gap-2 py-1 px-0.5 select-none">
                  <div className="flex-1 border-t border-zinc-800" />
                  <span
                    suppressHydrationWarning
                    className="text-[9px] font-mono text-zinc-400 font-medium px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 flex-shrink-0"
                  >
                    {dayLabel}
                  </span>
                </div>
              )}
              <MatchCard
                match={match}
                selectedWinnerId={selectedWinners[match.id]}
                isReadOnly={isReadOnly}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
                nextScheduledTime={
                  nextScheduledTimeMap ? nextScheduledTimeMap[match.id] : undefined
                }
                probability={probabilitiesMap?.[match.id]}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

RecordPoolGroup.displayName = 'RecordPoolGroup';
