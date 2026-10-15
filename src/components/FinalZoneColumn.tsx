import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';
import { TeamRosterTooltip } from './TeamRosterTooltip';
import { sanitizeString } from '../utils/security';

interface FinalZoneColumnProps {
  qualifiedTeams: Team[];
  eliminatedTeams: Team[];
}

export const FinalZoneColumn: React.FC<FinalZoneColumnProps> = memo(({
  qualifiedTeams,
  eliminatedTeams,
}) => {
  const sortedQualified = useMemo(
    () => [...qualifiedTeams].sort((a, b) => a.losses - b.losses),
    [qualifiedTeams]
  );

  // Stack ordering:
  // - Top of stack: Most recently eliminated teams (Round 5: 2-3, Round 4: 1-3, Round 3: 0-3)
  // - Bottom of stack: First eliminated teams in the tournament (Play-in candidates)
  const sortedEliminated = useMemo(() => {
    return [...eliminatedTeams].sort((a, b) => {
      // Play-in eliminated teams always go to the bottom (stack bottom)
      if (a.isPlayInEliminated && !b.isPlayInEliminated) return 1;
      if (!a.isPlayInEliminated && b.isPlayInEliminated) return -1;
      if (a.isPlayInEliminated && b.isPlayInEliminated) {
        return a.name.localeCompare(b.name);
      }

      // Swiss eliminated teams:
      // Higher wins (2-3) means eliminated later in Round 5 -> top of stack
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.name.localeCompare(b.name);
    });
  }, [eliminatedTeams]);

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
      <TeamRosterTooltip key={team.id} team={team}>
        <div
          className="h-7 rounded border border-zinc-750 bg-zinc-900/80 px-2 flex items-center justify-between hover:border-zinc-650 transition-colors duration-150 cursor-default"
        >
          {/* Team Details */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
            <span className="text-[10px] font-mono text-zinc-400 font-medium w-3.5">
              #{index + 1}
            </span>
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
              <span className="text-[11px] font-semibold text-white truncate">
                {sanitizeString(team.name)}
              </span>
              <span className="text-[9px] text-zinc-400 font-normal">
                {team.region}
              </span>
            </div>
          </div>

          {/* Final Record / Play-In Stage Pill */}
          <span
            className={`text-[11px] font-mono font-bold flex-shrink-0 ${
              isQualified
                ? 'text-emerald-400'
                : team.isPlayInEliminated
                ? 'text-zinc-400 font-medium text-[10px]'
                : 'text-rose-400'
            }`}
          >
            {team.isPlayInEliminated ? 'Play-In' : `${team.wins}-${team.losses}`}
          </span>
        </div>
      </TeamRosterTooltip>
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

      {/* 2. Eliminados (Underneath - Stack order: Last eliminated at top, Play-in at bottom) */}
      <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/50">
        <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70 rounded-t-xl">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            <span className="text-xs font-bold text-zinc-300 truncate">
              Eliminados
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/30 flex-shrink-0">
            {eliminatedTeams.length}/11
          </span>
        </div>

        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[calc((100vh-210px)/2)]">
          {sortedEliminated.length === 0 ? (
            <div className="h-7 rounded border border-dashed border-zinc-800 bg-zinc-950/40 flex items-center justify-between px-2 text-xs">
              <span className="font-mono text-[10px] text-zinc-500 font-medium">#1</span>
              <span className="text-[10px] text-zinc-600 font-normal">Esperando</span>
            </div>
          ) : (
            sortedEliminated.map((team, idx) => (
              <React.Fragment key={team.id}>
                {team.isPlayInEliminated && idx > 0 && !sortedEliminated[idx - 1]?.isPlayInEliminated && (
                  <div className="flex items-center gap-1.5 my-1 px-1">
                    <div className="flex-1 border-t border-zinc-800" />
                    <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 font-medium">
                      Fase Play-In
                    </span>
                    <div className="flex-1 border-t border-zinc-800" />
                  </div>
                )}
                {renderSlot(team, false, idx)}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

FinalZoneColumn.displayName = 'FinalZoneColumn';

