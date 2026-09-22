import React from 'react';
import Image from 'next/image';
import { PlayoffMatch } from '../../types/playoffs';
import { Team } from '../../types/swiss';
import { getTeamImage } from '../../data/teamImages';
import { Check } from 'lucide-react';

interface PlayoffMatchCardProps {
  match: PlayoffMatch;
  matchTitle?: string;
  onSelectWinner: (matchId: string, winnerId: string) => void;
}

export const PlayoffMatchCard: React.FC<PlayoffMatchCardProps> = ({
  match,
  matchTitle,
  onSelectWinner,
}) => {
  const renderTeamRow = (team: Team | null, isTop: boolean) => {
    if (!team) {
      return (
        <div className="w-full h-8 flex items-center justify-between px-2.5 py-1.5 rounded text-left text-zinc-600 bg-zinc-950/40 border border-dashed border-zinc-800/80">
          <span className="text-[11px] font-normal italic">Por definir</span>
        </div>
      );
    }

    const isWinner = match.winnerId === team.id;
    const isLoser = match.winnerId !== null && !isWinner;

    return (
      <button
        type="button"
        onClick={() => onSelectWinner(match.id, team.id)}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors duration-150 ${
          isWinner
            ? 'bg-zinc-800 text-white font-medium border border-amber-400/60 shadow-sm'
            : isLoser
            ? 'opacity-40 text-zinc-400 hover:opacity-80 hover:bg-zinc-800/40'
            : 'text-zinc-200 hover:bg-zinc-800/70 border border-transparent'
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
              {team.name}
            </span>
            <span className="text-[10px] text-zinc-400 flex-shrink-0 font-normal">
              {team.region}
            </span>
          </div>
        </div>

        {/* Right: Swiss Record & Checkmark */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-mono text-zinc-400">
            {team.wins}-{team.losses}
          </span>

          {isWinner && (
            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-amber-400 bg-amber-400/20">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </div>
      </button>
    );
  };

  const isPlayable = !!(match.team1 && match.team2);

  return (
    <div className="w-full bg-zinc-900 rounded-lg border border-zinc-750 p-1.5 hover:border-zinc-650 transition-colors duration-150 shadow-sm">
      {matchTitle && (
        <div className="px-1.5 pt-0.5 pb-1 flex items-center justify-between border-b border-zinc-800 mb-1">
          <span className="text-[10px] uppercase font-mono font-medium text-zinc-400">
            {matchTitle}
          </span>
          {isPlayable && !match.winnerId && (
            <span className="text-[9px] text-amber-400/80 font-normal">
              Elige ganador
            </span>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        {renderTeamRow(match.team1, true)}
        {renderTeamRow(match.team2, false)}
      </div>
    </div>
  );
};

