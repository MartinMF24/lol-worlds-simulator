'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { TIMEZONE_OPTIONS, TimezoneOption } from '../types/timezone';
import { Globe, Check, ChevronUp } from 'lucide-react';

interface TimezoneSelectorProps {
  selectedTimezone: TimezoneOption;
  onSelectTimezone: (tz: TimezoneOption) => void;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = memo(({
  selectedTimezone,
  onSelectTimezone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = TIMEZONE_OPTIONS[selectedTimezone] || TIMEZONE_OPTIONS.ART;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 select-none">
      {/* Dropdown Menu (Opens Upward) */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-52 sm:w-56 rounded-lg bg-zinc-900/98 backdrop-blur-md border border-zinc-750 shadow-2xl p-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500 border-b border-zinc-800/80 mb-1">
            Zona Horaria
          </div>

          <div className="space-y-1">
            {(Object.keys(TIMEZONE_OPTIONS) as TimezoneOption[]).map((tzKey) => {
              const option = TIMEZONE_OPTIONS[tzKey];
              const isSelected = selectedTimezone === tzKey;

              return (
                <button
                  key={tzKey}
                  type="button"
                  onClick={() => {
                    onSelectTimezone(tzKey);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    isSelected
                      ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30'
                      : 'text-zinc-300 hover:bg-zinc-800/70 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{option.flag}</span>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="truncate">{option.label}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {option.city} • {option.offsetLabel}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 backdrop-blur-md border border-zinc-750 hover:border-zinc-650 text-zinc-200 text-xs font-mono shadow-lg transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/50 cursor-pointer"
        title="Cambiar zona horaria de los partidos"
        aria-label="Selector de zona horaria"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-sm leading-none">{currentConfig.flag}</span>
        <span className="font-medium text-[11px] text-zinc-300">
          {currentConfig.id}
        </span>
        <span className="hidden sm:inline text-[10px] text-zinc-500">
          ({currentConfig.offsetLabel})
        </span>
        <ChevronUp
          className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>
    </div>
  );
});

TimezoneSelector.displayName = 'TimezoneSelector';
export default TimezoneSelector;
