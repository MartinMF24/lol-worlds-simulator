import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Trophy, Info, Sparkles, Dices, ChevronDown } from 'lucide-react';

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
  onAutoPickByProbability?: () => void;
  isPlayoffsRealDraw?: boolean;
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
  onAutoPickByProbability,
  isPlayoffsRealDraw = false,
}) => {
  const [isAutoPickMenuOpen, setIsAutoPickMenuOpen] = useState(false);
  const autoPickRef = useRef<HTMLDivElement>(null);

  // Close auto-pick dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autoPickRef.current && !autoPickRef.current.contains(event.target as Node)) {
        setIsAutoPickMenuOpen(false);
      }
    };

    if (isAutoPickMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAutoPickMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-3 sm:px-6 h-14 flex items-center">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Title & Stage Tabs */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">
              Worlds 2026
            </span>
          </div>

          {/* Minimal Tab Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => onTabChange('swiss')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors duration-150 ${
                activeTab === 'swiss'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fase Suiza
            </button>

            <button
              type="button"
              disabled={!isPlayInSelected && !isPlayoffsRealDraw}
              onClick={() => onTabChange('playoffs')}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-xs transition-colors duration-150 flex items-center gap-1.5 ${
                !isPlayInSelected && !isPlayoffsRealDraw
                  ? 'text-zinc-600 cursor-not-allowed opacity-50'
                  : activeTab === 'playoffs'
                  ? 'bg-zinc-800 text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Playoffs</span>
              {(isFinished || isPlayoffsRealDraw) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Stage Context Info (Hidden on screens < lg to preserve mobile space) */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-medium">
          {!isPlayInSelected && !isPlayoffsRealDraw ? (
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
              {isPlayoffsRealDraw && (
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">
                  Sorteo Oficial
                </span>
              )}
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
        <div className="flex items-center gap-1.5 sm:gap-2.5">
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

            <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 sm:w-80 p-3 rounded-lg bg-zinc-900/98 backdrop-blur-md border border-zinc-750 shadow-xl text-zinc-300 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-100 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Versión 2.0</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Actualizado con el sorteo oficial y horarios reales de la Ronda 1. Se incorporó el cuadro de Playoffs, ratings competitivos para cada equipo y cálculo de probabilidades de victoria con simulación de Monte Carlo. Se irá actualizando en tiempo real conforme avance el torneo.
              </p>
            </div>
          </div>

          {/* Action buttons (when Play-in is defined or Playoffs is in real draw) */}
          {(isPlayInSelected || isPlayoffsRealDraw) && (
            <>
              {activeTab === 'swiss' ? (
                <>
                  {!isFinished ? (
                    <>
                      {/* Auto-Pick Split Button (Aleatorio / Probabilidad) */}
                      <div className="relative" ref={autoPickRef}>
                        <div className="flex items-center rounded-md border border-zinc-750 bg-zinc-900">
                          <button
                            type="button"
                            onClick={onAutoPick}
                            className="text-xs text-zinc-200 hover:text-white hover:bg-zinc-800 px-2 sm:px-2.5 py-1.5 rounded-l-md transition-colors duration-150 font-medium cursor-pointer"
                            title="Auto-completar aleatorio (50/50)"
                          >
                            <span className="hidden sm:inline">Auto-pick</span>
                            <span className="sm:hidden text-[11px]">Auto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAutoPickMenuOpen((v) => !v)}
                            className="px-1.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border-l border-zinc-750 rounded-r-md transition-colors duration-150 cursor-pointer"
                            title="Opciones de Auto-pick"
                            aria-label="Opciones de Auto-pick"
                          >
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-150 ${
                                isAutoPickMenuOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {isAutoPickMenuOpen && (
                          <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg bg-zinc-900/95 backdrop-blur-md border border-zinc-750 shadow-xl py-1 z-50">
                            <button
                              type="button"
                              onClick={() => {
                                onAutoPick();
                                setIsAutoPickMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2.5 transition-colors duration-150 cursor-pointer"
                            >
                              <Dices className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium text-zinc-200">Aleatorio</span>
                                <span className="text-[10px] text-zinc-500">50% / 50% al azar</span>
                              </div>
                            </button>
                            {onAutoPickByProbability && (
                              <button
                                type="button"
                                onClick={() => {
                                  onAutoPickByProbability();
                                  setIsAutoPickMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2.5 border-t border-zinc-800 transition-colors duration-150 cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-amber-300">Por Probabilidad</span>
                                  <span className="text-[10px] text-zinc-500">Favorito de Monte Carlo</span>
                                </div>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Confirm Round Button */}
                      <button
                        type="button"
                        onClick={onConfirmRound}
                        disabled={!isRoundComplete}
                        className={`text-xs font-semibold px-2.5 sm:px-4 py-1.5 rounded-md transition-colors duration-150 ${
                          isRoundComplete
                            ? 'bg-white hover:bg-zinc-100 text-zinc-950 cursor-pointer shadow-sm'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                        }`}
                      >
                        {isRoundComplete ? (
                          currentRound === 5 ? (
                            'Finalizar'
                          ) : (
                            <>
                              <span className="hidden sm:inline">Confirmar </span>R{currentRound}
                            </>
                          )
                        ) : (
                          <>
                            <span className="hidden sm:inline">Definir </span>({selectedCount}/{totalMatchesInRound})
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onTabChange('playoffs')}
                      className="text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black px-3 sm:px-3.5 py-1.5 rounded-md transition-colors duration-150 shadow-sm"
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
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 bg-zinc-900 border border-zinc-750 px-2.5 sm:px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
                    title="Reiniciar el cuadro de Playoffs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar<span className="hidden sm:inline"> Playoffs</span></span>
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
