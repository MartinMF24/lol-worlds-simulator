'use client';

import React from 'react';
import Image from 'next/image';
import { Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';
import { sanitizeString } from '../utils/security';
import { getTeamRatings, getTeamOverallRating } from '../data/teamRatings';

export interface TeamRosterPopoverProps {
  team: Team;
  coords: { top: number; left: number };
}

const ROLES = [
  { key: 'top', label: 'Top', icon: '/assets/role_top.webp' },
  { key: 'jungle', label: 'Jungla', icon: '/assets/role_jungle.webp' },
  { key: 'mid', label: 'Mid', icon: '/assets/role_mid.webp' },
  { key: 'bot', label: 'Bot / ADC', icon: '/assets/role_bot.webp' },
  { key: 'support', label: 'Soporte', icon: '/assets/role_support.webp' },
] as const;

export const TeamRosterPopover: React.FC<TeamRosterPopoverProps> = ({ team, coords }) => {
  const ratings = getTeamRatings(team.id);
  const overallRating = Math.round(getTeamOverallRating(team.id));

  return (
    <div
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="fixed z-[9999] pointer-events-none w-[240px] bg-zinc-900 border border-zinc-750 rounded-md p-2.5 shadow-xl text-left select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header: Team name, icon, region on left | Ratings on right */}
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-zinc-800">
        {/* Left: Avatar, Name and Region */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 h-5 rounded overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700 relative">
            <Image
              src={getTeamImage(team.imageKey)}
              alt={team.name}
              width={20}
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-xs font-bold text-white truncate leading-tight"
              title={sanitizeString(team.name)}
            >
              {sanitizeString(team.name)}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono leading-tight">
              {team.region} • Roster
            </div>
          </div>
        </div>

        {/* Right: Overall Rating & 3 Sub-ratings underneath */}
        <div className="flex flex-col items-end flex-shrink-0 text-right">
          {/* Rating Medio */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono font-medium">
              Rating
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/25 leading-none">
              {overallRating}
            </span>
          </div>

          {/* 3 Ratings que la conforman (Individual, Equipo, Estratégico) */}
          <div className="flex items-center gap-1 text-[8.5px] font-mono text-zinc-400 mt-1 leading-none">
            <span title="Nivel Individual / Micro (35%)">
              <span className="text-zinc-500">Ind:</span>
              <span className="text-zinc-200 font-semibold ml-0.5">{ratings.individual}</span>
            </span>
            <span className="text-zinc-650">•</span>
            <span title="Nivel de Equipo / Macro (40%)">
              <span className="text-zinc-500">Eq:</span>
              <span className="text-zinc-200 font-semibold ml-0.5">{ratings.teamplay}</span>
            </span>
            <span className="text-zinc-650">•</span>
            <span title="Nivel Estratégico / Drafts (25%)">
              <span className="text-zinc-500">Est:</span>
              <span className="text-zinc-200 font-semibold ml-0.5">{ratings.strategy}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5 Vertical Roles List with Role Icons */}
      <div className="space-y-1.5">
        {ROLES.map(({ key, label, icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-2.5 px-1.5 py-0.5 rounded bg-zinc-950/40"
          >
            <div
              className="w-4 h-4 flex items-center justify-center flex-shrink-0 relative"
              title={label}
            >
              <Image
                src={icon}
                alt={label}
                width={16}
                height={16}
                className="w-full h-full object-contain opacity-90"
              />
            </div>
            <span className="text-sm font-medium text-zinc-100 text-right truncate flex-1">
              {sanitizeString(team.roster?.[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRosterPopover;
