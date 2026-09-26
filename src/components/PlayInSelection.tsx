'use client';

import React from 'react';
import Image from 'next/image';
import { Team } from '../types/swiss';
import { PLAY_IN_CANDIDATES } from '../data/teams';
import { getTeamImage } from '../data/teamImages';
import { ArrowRight, Trophy } from 'lucide-react';

interface PlayInSelectionProps {
  onSelectTeam: (team: Team) => void;
}

export const PlayInSelection: React.FC<PlayInSelectionProps> = ({ onSelectTeam }) => {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 py-8">
      {/* Header Info */}
      <div className="text-center max-w-xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-750 text-zinc-400 text-xs font-medium mb-3">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Fase de Clasificación • Cupo 16</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          Selecciona el Clasificado de Play-in
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Elige qué equipo avanzará al evento principal como Seed 4. La Fase Suiza y el sorteo de la Ronda 1 se generarán automáticamente respetando las restricciones de región.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl w-full">
        {PLAY_IN_CANDIDATES.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => onSelectTeam(candidate)}
            className="group flex flex-col items-center p-5 rounded-lg bg-zinc-900/60 border border-zinc-750 hover:border-zinc-500 hover:bg-zinc-850/80 transition-all duration-200 cursor-pointer text-center relative focus:outline-none focus:ring-1 focus:ring-amber-400/50"
          >
            {/* Team Crest */}
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center p-2 mb-3.5 border border-zinc-700/80 group-hover:border-zinc-500 group-hover:scale-105 transition-all duration-200 relative">
              <Image
                src={getTeamImage(candidate.imageKey)}
                alt={candidate.name}
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Team Name */}
            <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate max-w-full">
              {candidate.name}
            </span>

            {/* Region & Seed Pill */}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-zinc-700">
                {candidate.region}
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                Seed 4
              </span>
            </div>

            {/* Subtle Action Hint */}
            <div className="mt-4 text-[11px] text-zinc-400 group-hover:text-amber-400 transition-colors font-medium flex items-center gap-1">
              <span>Clasificar</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

