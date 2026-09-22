import React from 'react';
import Image from 'next/image';
import { Team } from '../../types/swiss';
import { getTeamImage } from '../../data/teamImages';
import { Trophy } from 'lucide-react';

interface ChampionCardProps {
  champion: Team | null;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({ champion }) => {
  if (!champion) {
    return (
      <div className="w-full h-32 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-4 flex flex-col items-center justify-center text-center">
        <Trophy className="w-5 h-5 text-zinc-650 mb-1.5" />
        <span className="text-xs font-semibold text-zinc-400">
          Campeón del Mundo
        </span>
        <span className="text-[10px] text-zinc-500 mt-0.5">
          Se definirá en la Gran Final
        </span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-amber-400/50 bg-amber-400/10 p-4 flex flex-col items-center text-center shadow-sm">
      {/* Icon & Label */}
      <div className="flex items-center gap-1.5 text-amber-400 mb-2">
        <Trophy className="w-4 h-4" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
          Campeón del Mundo 2026
        </span>
      </div>

      {/* Team Avatar */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 border-2 border-amber-400/60 p-0.5 mb-2 shadow-sm relative">
        <Image
          src={getTeamImage(champion.imageKey)}
          alt={champion.name}
          width={56}
          height={56}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Team Details */}
      <h3 className="text-sm font-bold text-white tracking-tight">
        {champion.name}
      </h3>
      <span className="text-[11px] text-amber-300/80 font-medium">
        {champion.region} • Seed {champion.seed}
      </span>
      <span className="text-[10px] font-mono text-zinc-400 mt-1">
        Récord en Suizo: {champion.wins}-{champion.losses}
      </span>
    </div>
  );
};

