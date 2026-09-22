import React from 'react';
import { PlayoffBracket } from '../../types/playoffs';
import { PlayoffMatchCard } from './PlayoffMatchCard';
import { ChampionCard } from './ChampionCard';
import { Dices, Trophy, ArrowLeft } from 'lucide-react';

interface PlayoffsBracketProps {
  bracket: PlayoffBracket | null;
  canReroll: boolean;
  onReroll: () => void;
  onSelectWinner: (matchId: string, winnerId: string) => void;
  onBackToSwiss?: () => void;
}

export const PlayoffsBracket: React.FC<PlayoffsBracketProps> = ({
  bracket,
  canReroll,
  onReroll,
  onSelectWinner,
  onBackToSwiss,
}) => {
  if (!bracket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <Trophy className="w-8 h-8 text-zinc-650 mb-3" />
        <h2 className="text-sm font-bold text-white mb-1">
          Playoffs no disponibles
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-4">
          Es necesario completar la Fase Suiza para clasificar a los 8 equipos que disputarán los Playoffs.
        </p>
        {onBackToSwiss && (
          <button
            type="button"
            onClick={onBackToSwiss}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-750 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Fase Suiza</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top action row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {onBackToSwiss && (
            <button
              type="button"
              onClick={onBackToSwiss}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Fase Suiza</span>
            </button>
          )}
          <span className="text-xs font-semibold text-zinc-300">
            Cuadro de Eliminación Directa
          </span>
        </div>

        {/* Reroll Button: Visible ONLY in Quarters before ANY winner is picked */}
        {canReroll && (
          <button
            type="button"
            onClick={onReroll}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-medium transition-all shadow-sm"
            title="Re-sortear los emparejamientos de Cuartos de Final"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Volver a Sortear</span>
          </button>
        )}
      </div>

      {/* Bracket Canvas: 4 Columns */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full items-stretch min-h-[580px]">
        {/* Column 1: Cuartos de Final (4 matches) */}
        <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5">
          <div className="px-2 py-1.5 border-b border-zinc-800 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">
              Cuartos de Final
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Bo5
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            {/* Top Half */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider block px-1">
                Llave Superior
              </span>
              <PlayoffMatchCard
                match={bracket.quarters[0]}
                matchTitle="Partido 1 (3-0 vs 3-2)"
                onSelectWinner={onSelectWinner}
              />
              <PlayoffMatchCard
                match={bracket.quarters[1]}
                matchTitle="Partido 2"
                onSelectWinner={onSelectWinner}
              />
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-zinc-800/80 my-0.5" />

            {/* Bottom Half */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider block px-1">
                Llave Inferior
              </span>
              <PlayoffMatchCard
                match={bracket.quarters[2]}
                matchTitle="Partido 3"
                onSelectWinner={onSelectWinner}
              />
              <PlayoffMatchCard
                match={bracket.quarters[3]}
                matchTitle="Partido 4 (3-0 vs 3-2)"
                onSelectWinner={onSelectWinner}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Semifinales (2 matches) */}
        <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5">
          <div className="px-2 py-1.5 border-b border-zinc-800 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">
              Semifinales
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Bo5
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-around gap-6 py-4">
            {/* Semi 1 (Top) */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider block px-1">
                Semifinal 1
              </span>
              <PlayoffMatchCard
                match={bracket.semis[0]}
                onSelectWinner={onSelectWinner}
              />
            </div>

            {/* Semi 2 (Bottom) */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider block px-1">
                Semifinal 2
              </span>
              <PlayoffMatchCard
                match={bracket.semis[1]}
                onSelectWinner={onSelectWinner}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Gran Final (1 match) */}
        <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5">
          <div className="px-2 py-1.5 border-b border-zinc-800 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">
              Gran Final
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold">
              Bo5
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-3 py-6">
            <span className="text-[9px] uppercase font-mono text-amber-400/80 tracking-wider text-center block">
              Serie por el Título
            </span>
            <PlayoffMatchCard
              match={bracket.final}
              onSelectWinner={onSelectWinner}
            />
          </div>
        </div>

        {/* Column 4: Campeón del Mundo */}
        <div className="flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5">
          <div className="px-2 py-1.5 border-b border-zinc-800 flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300">
              Campeón
            </span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="flex-1 flex flex-col justify-center py-6">
            <ChampionCard champion={bracket.champion} />
          </div>
        </div>
      </div>
    </div>
  );
};

