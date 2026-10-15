import React, { memo, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Match, Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';
import { TeamRosterTooltip } from './TeamRosterTooltip';
import { sanitizeString } from '../utils/security';
import { formatMatchTime } from '../utils/timezone';
import { Check, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  selectedWinnerId?: string | null;
  isReadOnly?: boolean;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
  timeZone?: string;
  nextScheduledTime?: string;
}

export const MatchCard: React.FC<MatchCardProps> = memo(({
  match,
  selectedWinnerId,
  isReadOnly = false,
  onSelectWinner,
  timeZone = 'America/Argentina/Buenos_Aires',
  nextScheduledTime,
}) => {
  const effectiveWinnerId = isReadOnly ? match.winnerId : selectedWinnerId;

  // Format match start time according to the selected timezone
  const formattedTime = useMemo(() => {
    return formatMatchTime(match.scheduledTime, timeZone);
  }, [match.scheduledTime, timeZone]);

  // Strict "EN VIVO" (LIVE) state logic
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!match.scheduledTime) {
      setIsLive(false);
      return;
    }

    const evaluateLiveStatus = () => {
      // If a winner is already selected, the match is no longer in progress
      if (effectiveWinnerId) {
        setIsLive(false);
        return;
      }

      const now = Date.now();
      const startTime = new Date(match.scheduledTime!).getTime();
      const endTime = nextScheduledTime
        ? new Date(nextScheduledTime).getTime()
        : startTime + 60 * 60 * 1000; // Default 1h duration for the last match of the day

      // LIVE condition: now >= scheduledTime and now < nextScheduledTime
      const currentlyLive = now >= startTime && now < endTime;
      setIsLive(currentlyLive);
    };

    evaluateLiveStatus();
    // Check every 10 seconds so live state transitions in real time without refreshing
    const timer = setInterval(evaluateLiveStatus, 10000);
    return () => clearInterval(timer);
  }, [match.scheduledTime, nextScheduledTime, effectiveWinnerId]);

  const renderTeamRow = (team: Team) => {
    const isWinner = effectiveWinnerId === team.id;
    const isLoser = effectiveWinnerId !== null && effectiveWinnerId !== undefined && !isWinner;
    const isSelectedInActive = !isReadOnly && isWinner;

    return (
      <TeamRosterTooltip team={team}>
        <button
          type="button"
          disabled={isReadOnly}
          onClick={() => onSelectWinner && onSelectWinner(match.id, team.id)}
          className={`w-full h-8 flex items-center justify-between px-2 rounded text-left transition-colors duration-150 border ${
            isReadOnly
              ? isWinner
                ? 'bg-zinc-800 text-white font-medium border-zinc-650'
                : 'opacity-50 text-zinc-400 border-transparent'
              : isSelectedInActive
              ? 'bg-amber-400/15 text-white font-medium border-amber-400 shadow-sm'
              : isLoser
              ? 'opacity-40 text-zinc-400 hover:opacity-80 hover:bg-zinc-800/40 border-transparent'
              : 'text-zinc-200 hover:bg-zinc-800/70 border-transparent'
          }`}
        >
          {/* Left: Avatar & Team Info */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
            <div className="w-4 h-4 rounded overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700 relative">
              <Image
                src={getTeamImage(team.imageKey)}
                alt={team.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] sm:text-xs font-semibold text-white truncate block">
                {sanitizeString(team.name)}
              </span>
              <span className="text-[9px] text-zinc-400 flex-shrink-0 font-normal">
                {team.region}
              </span>
            </div>
          </div>

          {/* Right: Record & Status Indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-300">
              {team.wins}-{team.losses}
            </span>

            {/* Fixed-width checkmark container so row dimensions never shift */}
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity duration-150 ${
                isWinner
                  ? isReadOnly
                    ? 'text-zinc-200 bg-zinc-700 opacity-100'
                    : 'text-amber-400 bg-amber-400/20 opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
        </button>
      </TeamRosterTooltip>
    );
  };

  // Stakes tag
  let stakesLabel: React.ReactNode = null;
  if (match.isHighMatch && match.isLowMatch) {
    stakesLabel = (
      <span className="text-[9px] font-medium text-purple-300">
        Decisivo
      </span>
    );
  } else if (match.isHighMatch) {
    stakesLabel = (
      <span className="text-[9px] font-medium text-amber-300">
        Pase a Playoffs
      </span>
    );
  } else if (match.isLowMatch) {
    stakesLabel = (
      <span className="text-[9px] font-medium text-rose-300">
        Eliminación
      </span>
    );
  }

  const hasHeaderContent =
    !!match.scheduledTime ||
    !!stakesLabel ||
    (!!match.poolRecord && match.poolRecord !== '0-0');

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-750 p-1 hover:border-zinc-650 transition-colors duration-150 w-full">
      {hasHeaderContent && (
        <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-zinc-800 mb-0.5 min-h-[22px]">
          {/* Left: Pool Record or Bo1 & Stakes */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-medium">
              {match.poolRecord === '0-0' ? 'Bo1' : match.poolRecord}
            </span>
            {stakesLabel}
          </div>

          {/* Right: Time / LIVE status badge */}
          {isLive ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[9px] font-mono font-bold leading-none animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>EN VIVO</span>
            </div>
          ) : formattedTime ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
              <Clock className="w-2.5 h-2.5 text-zinc-500" />
              <span suppressHydrationWarning>{formattedTime}</span>
            </div>
          ) : null}
        </div>
      )}

      <div className="space-y-0.5">
        {renderTeamRow(match.team1)}
        {renderTeamRow(match.team2)}
      </div>
    </div>
  );
});

MatchCard.displayName = 'MatchCard';
export default MatchCard;
