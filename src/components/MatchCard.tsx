import React, { memo } from 'react';
import Image from 'next/image';
import { Match, Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';
import { TeamRosterTooltip } from './TeamRosterTooltip';
import { sanitizeString } from '../utils/security';
import { Check } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  selectedWinnerId?: string | null;
  isReadOnly?: boolean;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = memo(({
  match,
  selectedWinnerId,
  isReadOnly = false,
  onSelectWinner,
}) => {
  const effectiveWinnerId = isReadOnly ? match.winnerId : selectedWinnerId;

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

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-750 p-1 hover:border-zinc-650 transition-colors duration-150 w-full">
      {stakesLabel && (
        <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-zinc-800 mb-0.5">
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-medium">
            {match.poolRecord}
          </span>
          {stakesLabel}
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
