import React from 'react';
import { RotateCcw, Trophy, Info } from 'lucide-react';

export type ActiveTab = 'swiss' | 'playoffs';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isPlayInSelected?: boolean;
  currentRound: number;
  totalMatchesInRound: number;
  selectedCount: number;
  isRoundComplete: boolean;
  qualifiedCount: number;
  eliminatedCount: number;
  isFinished: boolean;
  hasChampion: boolean;
  onConfirmRound: () => void;
  onAutoPick: () => void;
  onResetSwiss: () => void;
  onResetPlayoffs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isPlayInSelected = true,
  currentRound,
  totalMatchesInRound,
  selectedCount,
  isRoundComplete,
  qualifiedCount,
  eliminatedCount,
  isFinished,
  hasChampion,
  onConfirmRound,
  onAutoPick,
  onResetSwiss,
  onResetPlayoffs,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-6 h-14 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Title & Stage Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white">
              Worlds 2026
            </span>
          </div>

          {/* Minimal Tab Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => onTabChange('swiss')}
              className={`px-3 py-1 rounded-md text-xs transition-colors duration-150 ${
                activeTab === 'swiss'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fase Suiza
            </button>

            <button
              type="button"
              disabled={!isPlayInSelected}
              onClick={() => onTabChange('playoffs')}
              className={`px-3 py-1 rounded-md text-xs transition-colors duration-150 flex items-center gap-1.5 ${
                !isPlayInSelected
                  ? 'text-zinc-600 cursor-not-allowed opacity-50'
                  : activeTab === 'playoffs'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Playoffs</span>
              {isFinished && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Stage Context Info */}
        <div className="flex items-center gap-2.5 text-xs font-medium">
          {!isPlayInSelected ? (
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Fase de Selección • Play-in</span>
            </div>
          ) : activeTab === 'swiss' ? (
            <>
              <span className="text-zinc-200">
                {isFinished ? 'Fase Suiza concluida' : `Ronda ${currentRound} de 5`}
              </span>
              <span className="text-zinc-650">•</span>
              <span className="text-emerald-400 font-semibold">
                {qualifiedCount}/8 clasificados
              </span>
              <span className="text-zinc-650">•</span>
              <span className="text-rose-400 font-semibold">
                {eliminatedCount}/8 eliminados
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2 text-zinc-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Cuadro de Eliminación Directa</span>
              {hasChampion && (
                <>
                  <span className="text-zinc-650">•</span>
                  <span className="text-amber-300 font-semibold">¡Campeón Coronado!</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Info Tooltip (Always accessible) */}
          <div className="relative group flex items-center">
            <button
              type="button"
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 p-1.5 rounded-md transition-colors duration-150"
              title="Información del simulador"
              aria-label="Información del simulador"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-zinc-750 shadow-xl text-zinc-300 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-100 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Modo de Prueba</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Este simulador es un modo de prueba. Se irá actualizando a medida que se definan los equipos restantes y se acomodará en tiempo real conforme se disputen las rondas en la vida real.
              </p>
            </div>
          </div>

          {/* Action buttons (only when Play-in is defined) */}
          {isPlayInSelected && (
            <>
              {activeTab === 'swiss' ? (
                <>
                  {!isFinished ? (
                    <>
                      {/* Auto-completar */}
                      <button
                        type="button"
                        onClick={onAutoPick}
                        className="text-xs text-zinc-200 hover:text-white hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
                      >
                        Auto-completar
                      </button>

                      {/* Confirm Round Button */}
                      <button
                        type="button"
                        onClick={onConfirmRound}
                        disabled={!isRoundComplete}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-colors duration-150 ${
                          isRoundComplete
                            ? 'bg-white hover:bg-zinc-100 text-zinc-950 cursor-pointer shadow-sm'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                        }`}
                      >
                        {isRoundComplete
                          ? currentRound === 5
                            ? 'Finalizar Suizo'
                            : `Confirmar Ronda ${currentRound}`
                          : `Definir (${selectedCount}/${totalMatchesInRound})`}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onTabChange('playoffs')}
                      className="text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-1.5 rounded-md transition-colors duration-150 shadow-sm"
                    >
                      Ir a Playoffs →
                    </button>
                  )}

                  {/* Reset Tournament */}
                  <button
                    type="button"
                    onClick={onResetSwiss}
                    className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 p-1.5 rounded-md transition-colors duration-150"
                    title="Reiniciar Torneo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Reset Playoffs Bracket */}
                  <button
                    type="button"
                    onClick={onResetPlayoffs}
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
                    title="Reiniciar el cuadro de Playoffs al sorteo inicial"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Playoffs</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
