import React from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

export type ActiveTab = 'swiss' | 'playoffs';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
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
              onClick={() => onTabChange('playoffs')}
              className={`px-3 py-1 rounded-md text-xs transition-colors duration-150 flex items-center gap-1.5 ${
                activeTab === 'playoffs'
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
          {activeTab === 'swiss' ? (
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

              {/* Reset Swiss */}
              <button
                type="button"
                onClick={onResetSwiss}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 p-1.5 rounded-md transition-colors duration-150"
                title="Reiniciar Fase Suiza"
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
        </div>
      </div>
    </header>
  );
};
