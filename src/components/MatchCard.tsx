import React from 'react';
import { Match, Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';
import { Check } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  selectedWinnerId?: string | null;
  isReadOnly?: boolean;
  onSelectWinner?: (winnerId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
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
      <button
        type="button"
        disabled={isReadOnly}
        onClick={() => onSelectWinner && onSelectWinner(team.id)}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors duration-150 ${
          isReadOnly
            ? isWinner
              ? 'bg-zinc-800 text-white font-medium border border-zinc-650'
              : 'opacity-50 text-zinc-400'
            : isSelectedInActive
            ? 'bg-amber-400/15 text-white border border-amber-400 shadow-sm'
            : isLoser
            ? 'opacity-40 text-zinc-400 hover:opacity-80 hover:bg-zinc-800/40'
            : 'text-zinc-200 hover:bg-zinc-800/70 border border-transparent'
        }`}
      >
        {/* Left: Avatar & Team Info */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
          <div className="w-4 h-4 rounded overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700">
            <img
              src={getTeamImage(team.imageKey)}
              alt={team.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-white truncate block">
              {team.name}
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

          {isWinner && (
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                isReadOnly
                  ? 'text-zinc-200 bg-zinc-700'
                  : 'text-amber-400 bg-amber-400/20'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </div>
      </button>
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
};
