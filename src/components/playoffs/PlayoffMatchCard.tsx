import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { PlayoffMatch } from '../../types/playoffs';
import { Team } from '../../types/swiss';
import { getTeamImage } from '../../data/teamImages';
import { TeamRosterTooltip } from '../TeamRosterTooltip';
import { sanitizeString } from '../../utils/security';
import { formatMatchDateTime } from '../../utils/timezone';
import { Check, Clock } from 'lucide-react';

interface PlayoffMatchCardProps {
  match: PlayoffMatch;
  matchTitle?: string;
  onSelectWinner: (matchId: string, winnerId: string) => void;
  timeZone?: string;
}

export const PlayoffMatchCard: React.FC<PlayoffMatchCardProps> = memo(({
  match,
  matchTitle,
  onSelectWinner,
  timeZone = 'America/Argentina/Buenos_Aires',
}) => {
  const formattedDateTime = useMemo(() => {
    return match.scheduledTime ? formatMatchDateTime(match.scheduledTime, timeZone) : '';
  }, [match.scheduledTime, timeZone]);

  const renderTeamRow = (team: Team | null, isTop: boolean) => {
    if (!team) {
      return (
        <div className="w-full h-8 flex items-center justify-between px-2.5 rounded text-left text-zinc-600 bg-zinc-950/40 border border-dashed border-zinc-800/80">
          <span className="text-[11px] font-normal italic">Por definir</span>
        </div>
      );
    }

    const isWinner = match.winnerId === team.id;
    const isLoser = match.winnerId !== null && !isWinner;
    const isOfficial = !!match.isOfficialWinner;

    return (
      <TeamRosterTooltip team={team}>
        <button
          type="button"
          disabled={isOfficial}
          onClick={() => !isOfficial && onSelectWinner(match.id, team.id)}
          className={`w-full h-8 flex items-center justify-between px-2.5 rounded text-left transition-colors duration-150 border ${
            isWinner
              ? isOfficial
                ? 'bg-emerald-500/10 text-white font-medium border-emerald-500/30 cursor-default'
                : 'bg-zinc-800 text-white font-medium border-amber-400/60 shadow-sm'
              : isLoser
              ? isOfficial
                ? 'opacity-40 text-zinc-400 border-transparent cursor-default'
                : 'opacity-40 text-zinc-400 hover:opacity-80 hover:bg-zinc-800/40 border-transparent'
              : isOfficial
              ? 'text-zinc-200 border-transparent cursor-default'
              : 'text-zinc-200 hover:bg-zinc-800/70 border-transparent'
          }`}
        >
          {/* Left: Avatar & Team Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
            <div className="w-4 h-4 rounded overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700 relative">
              <Image
                src={getTeamImage(team.imageKey)}
                alt={team.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-white truncate block">
                {sanitizeString(team.name)}
              </span>
              <span className="text-[10px] text-zinc-400 flex-shrink-0 font-normal">
                {team.region}
              </span>
            </div>
          </div>

          {/* Right: Swiss Record & Checkmark */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {team.wins !== undefined && team.losses !== undefined && (
              <span className="text-[10px] font-mono text-zinc-400">
                {team.wins}-{team.losses}
              </span>
            )}

            {/* Fixed-width checkmark container so row dimensions never shift */}
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity duration-150 ${
                isWinner
                  ? isOfficial
                    ? 'text-emerald-400 bg-emerald-500/20 opacity-100 ring-1 ring-emerald-500/40'
                    : 'text-amber-400 bg-amber-400/20 opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
              title={
                isWinner
                  ? isOfficial
                    ? 'Ganador oficial definido en el torneo real'
                    : 'Ganador seleccionado por simulación'
                  : undefined
              }
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          </div>
        </button>
      </TeamRosterTooltip>
    );
  };

  const isPlayable = !!(match.team1 && match.team2);

  return (
    <div className="w-full bg-zinc-900 rounded-lg border border-zinc-750 p-1.5 hover:border-zinc-650 transition-colors duration-150 shadow-sm">
      <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-zinc-800 mb-1 min-h-[22px]">
        <div className="flex items-center gap-1.5 min-w-0">
          {matchTitle && (
            <span className="text-[10px] uppercase font-mono font-medium text-zinc-400">
              {matchTitle}
            </span>
          )}
          {match.isOfficialWinner && (
            <span className="text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/25 leading-none">
              Oficial
            </span>
          )}
        </div>

        {match.scheduledTime ? (
          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-400">
            <Clock className="w-2.5 h-2.5 text-zinc-500" />
            <span suppressHydrationWarning>
              {formattedDateTime}
            </span>
          </div>
        ) : isPlayable && !match.winnerId ? (
          <span className="text-[9px] text-amber-400/80 font-normal">
            Elige ganador
          </span>
        ) : null}
      </div>

      <div className="space-y-0.5">
        {renderTeamRow(match.team1, true)}
        {renderTeamRow(match.team2, false)}
      </div>
    </div>
  );
});

PlayoffMatchCard.displayName = 'PlayoffMatchCard';
