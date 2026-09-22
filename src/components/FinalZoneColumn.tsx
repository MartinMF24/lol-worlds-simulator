import React from 'react';
import { Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';

interface FinalZoneColumnProps {
  qualifiedTeams: Team[];
  eliminatedTeams: Team[];
}

export const FinalZoneColumn: React.FC<FinalZoneColumnProps> = ({
  qualifiedTeams,
  eliminatedTeams,
}) => {
  const sortedQualified = [...qualifiedTeams].sort((a, b) => a.losses - b.losses);
  const sortedEliminated = [...eliminatedTeams].sort((a, b) => b.wins - a.wins);

  const renderSlot = (team: Team | undefined, isQualified: boolean, index: number) => {
    if (!team) {
      return (
        <div
          key={`empty-${index}`}
          className="h-7 rounded border border-dashed border-zinc-800 bg-zinc-950/40 flex items-center justify-between px-2 text-xs"
        >
          <span className="font-mono text-[10px] text-zinc-500 font-medium">#{index + 1}</span>
          <span className="text-[10px] text-zinc-600 font-normal">Esperando</span>
        </div>
      );
    }

    return (
      <div
        key={team.id}
        className="h-7 rounded border border-zinc-750 bg-zinc-900/80 px-2 flex items-center justify-between hover:border-zinc-650 transition-colors duration-150"
      >
        {/* Team Details */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
          <span className="text-[10px] font-mono text-zinc-400 font-medium w-3.5">
            #{index + 1}
          </span>
          <div className="w-4 h-4 rounded overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700">
            <img
              src={getTeamImage(team.imageKey)}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[11px] font-semibold text-white truncate">
              {team.name}
            </span>
            <span className="text-[9px] text-zinc-400 font-normal">
              {team.region}
            </span>
          </div>
        </div>

        {/* Final Record */}
        <span
          className={`text-[11px] font-mono font-bold flex-shrink-0 ${
            isQualified ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {team.wins}-{team.losses}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-3">
      {/* 1. Clasificados a Playoffs (Top) */}
      <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/50">
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70 rounded-t-xl">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold text-white truncate">
              Clasificados
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 flex-shrink-0">
            {qualifiedTeams.length}/8
          </span>
        </div>

        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[calc((100vh-210px)/2)]">
          {Array.from({ length: 8 }).map((_, idx) =>
            renderSlot(sortedQualified[idx], true, idx)
          )}
        </div>
      </div>

      {/* 2. Eliminados (Underneath) */}
      <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/50">
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70 rounded-t-xl">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            <span className="text-xs font-bold text-zinc-300 truncate">
              Eliminados
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30 flex-shrink-0">
            {eliminatedTeams.length}/8
          </span>
        </div>

        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[calc((100vh-210px)/2)]">
          {Array.from({ length: 8 }).map((_, idx) =>
            renderSlot(sortedEliminated[idx], false, idx)
          )}
        </div>
      </div>
    </div>
  );
};
