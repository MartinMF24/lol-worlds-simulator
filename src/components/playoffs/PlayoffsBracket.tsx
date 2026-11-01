import React, { useCallback, useMemo, useEffect } from 'react';
import { PlayoffBracket } from '../../types/playoffs';
import { PlayoffMatchCard } from './PlayoffMatchCard';
import { ChampionCard } from './ChampionCard';
import { Dices, Trophy, ArrowLeft } from 'lucide-react';

const PLAYOFF_STAGES = [
  { id: 'quarters', label: 'Cuartos' },
  { id: 'semis', label: 'Semifinales' },
  { id: 'final', label: 'Gran Final' },
  { id: 'champion', label: 'Campeón' },
] as const;

interface PlayoffsBracketProps {
  bracket: PlayoffBracket | null;
  canReroll: boolean;
  onReroll: () => void;
  onSelectWinner: (matchId: string, winnerId: string) => void;
  onBackToSwiss?: () => void;
  timeZone?: string;
}

export const PlayoffsBracket: React.FC<PlayoffsBracketProps> = ({
  bracket,
  canReroll,
  onReroll,
  onSelectWinner,
  onBackToSwiss,
  timeZone,
}) => {
  const currentStage = useMemo(() => {
    if (!bracket) return 'quarters';
    if (bracket.champion) return 'champion';
    if (bracket.final?.winnerId) return 'champion';
    if (bracket.final?.team1 && bracket.final?.team2) return 'final';
    if (bracket.semis?.some((m) => m.team1 && m.team2)) return 'semis';
    return 'quarters';
  }, [bracket]);

  const scrollToColumn = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, []);

  // Auto-scroll mobile view to current active stage when bracket advances
  useEffect(() => {
    if (bracket && typeof window !== 'undefined' && window.innerWidth < 768) {
      scrollToColumn(`playoff-${currentStage}`);
    }
  }, [currentStage, bracket, scrollToColumn]);

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
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          {onBackToSwiss && (
            <button
              type="button"
              onClick={onBackToSwiss}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Fase Suiza</span>
            </button>
          )}
          <span className="text-xs font-semibold text-zinc-300 hidden sm:inline truncate">
            Cuadro de Eliminación Directa
          </span>
          {bracket.isRealDraw && (
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700 flex-shrink-0">
              Sorteo Oficial
            </span>
          )}
        </div>

        {/* Reroll Button: Visible ONLY in Quarters before ANY winner is picked AND if NOT official draw */}
        {canReroll && !bracket.isRealDraw && (
          <button
            type="button"
            onClick={onReroll}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-medium transition-all shadow-sm flex-shrink-0"
            title="Re-sortear los emparejamientos de Cuartos de Final"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Volver a Sortear</span>
          </button>
        )}
      </div>

      {/* Mobile Quick-Jump Stage Navigation */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-1 select-none">
        {PLAYOFF_STAGES.map((stage) => {
          const isCurrent = stage.id === currentStage;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => scrollToColumn(`playoff-${stage.id}`)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
              }`}
            >
              {stage.label}
            </button>
          );
        })}
      </div>

      {/* Bracket Canvas: 4 Columns (Snap-scrollable on mobile, 4-col grid on desktop) */}
      <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full md:min-w-[950px] overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 items-stretch min-h-[500px] md:min-h-[580px]">
        {/* Column 1: Cuartos de Final (4 matches) */}
        <div
          id="playoff-quarters"
          className="w-[84vw] max-w-[320px] flex-shrink-0 snap-center md:w-full md:max-w-none md:flex-shrink md:snap-align-none min-w-0 flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5"
        >
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
                matchTitle={bracket.isRealDraw ? "Cuartos 1" : "Partido 1 (3-0 vs 3-2)"}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
              />
              <PlayoffMatchCard
                match={bracket.quarters[1]}
                matchTitle={bracket.isRealDraw ? "Cuartos 2" : "Partido 2"}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
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
                matchTitle={bracket.isRealDraw ? "Cuartos 3" : "Partido 3"}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
              />
              <PlayoffMatchCard
                match={bracket.quarters[3]}
                matchTitle={bracket.isRealDraw ? "Cuartos 4" : "Partido 4 (3-0 vs 3-2)"}
                onSelectWinner={onSelectWinner}
                timeZone={timeZone}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Semifinales (2 matches) */}
        <div
          id="playoff-semis"
          className="w-[84vw] max-w-[320px] flex-shrink-0 snap-center md:w-full md:max-w-none md:flex-shrink md:snap-align-none min-w-0 flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5"
        >
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
                timeZone={timeZone}
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
                timeZone={timeZone}
              />
            </div>
          </div>
        </div>

        {/* Column 3: Gran Final (1 match) */}
        <div
          id="playoff-final"
          className="w-[84vw] max-w-[320px] flex-shrink-0 snap-center md:w-full md:max-w-none md:flex-shrink md:snap-align-none min-w-0 flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5"
        >
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
              timeZone={timeZone}
            />
          </div>
        </div>

        {/* Column 4: Campeón del Mundo */}
        <div
          id="playoff-champion"
          className="w-[84vw] max-w-[320px] flex-shrink-0 snap-center md:w-full md:max-w-none md:flex-shrink md:snap-align-none min-w-0 flex flex-col rounded-xl border border-zinc-750 bg-zinc-900/40 p-2.5"
        >
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
