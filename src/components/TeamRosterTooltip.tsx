'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Team } from '../types/swiss';
import { getTeamImage } from '../data/teamImages';

interface TeamRosterTooltipProps {
  team: Team;
  children: React.ReactNode;
  className?: string;
}

const ROLES = [
  { key: 'top', label: 'Top', icon: '/assets/role_top.png' },
  { key: 'jungle', label: 'Jungla', icon: '/assets/role_jungle.png' },
  { key: 'mid', label: 'Mid', icon: '/assets/role_mid.png' },
  { key: 'bot', label: 'Bot / ADC', icon: '/assets/role_bot.png' },
  { key: 'support', label: 'Soporte', icon: '/assets/role_support.png' },
] as const;

export const TeamRosterTooltip: React.FC<TeamRosterTooltipProps> = ({
  team,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 210;
    const tooltipHeight = 185;
    const padding = 10;

    let left: number;
    let top: number;

    // For larger cards (e.g. Play-In selection cards, height > 90px)
    if (rect.height > 90) {
      top = rect.top - tooltipHeight - padding;
      if (top < padding) {
        top = rect.bottom + padding;
      }
      left = rect.left + (rect.width - tooltipWidth) / 2;
      if (left < padding) left = padding;
      if (left + tooltipWidth > window.innerWidth - padding) {
        left = window.innerWidth - tooltipWidth - padding;
      }
    } else {
      // Compact match row: prefer to the right, fallback to left
      left = rect.right + padding;
      if (left + tooltipWidth > window.innerWidth - padding) {
        left = rect.left - tooltipWidth - padding;
        if (left < padding) {
          left = Math.max(padding, Math.min(rect.left, window.innerWidth - tooltipWidth - padding));
        }
      }

      // Align vertically with center of row
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      if (top < padding) top = padding;
      if (top + tooltipHeight > window.innerHeight - padding) {
        top = window.innerHeight - tooltipHeight - padding;
      }
    }

    setCoords({ top, left });
  }, []);

  const handleMouseEnter = () => {
    if (!team.roster) return;
    clearTimer();
    // Delay 1 second (1000ms) before opening
    timerRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimer();
    setIsOpen(false);
  };

  // Close when scrolling or resizing so popover does not become detached
  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => {
      setIsOpen(false);
      clearTimer();
    };
    window.addEventListener('scroll', handleClose, { capture: true, passive: true });
    window.addEventListener('resize', handleClose);
    return () => {
      window.removeEventListener('scroll', handleClose, { capture: true });
      window.removeEventListener('resize', handleClose);
    };
  }, [isOpen, clearTimer]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {children}

      {isMounted &&
        isOpen &&
        team.roster &&
        createPortal(
          <div
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed z-[9999] pointer-events-none w-[210px] bg-zinc-900 border border-zinc-750 rounded-md p-2.5 shadow-xl text-left select-none animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header: Team name, icon and region */}
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800">
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
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {team.name}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono leading-tight">
                  {team.region} • Roster
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
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 relative" title={label}>
                    <Image
                      src={icon}
                      alt={label}
                      width={16}
                      height={16}
                      className="w-full h-full object-contain opacity-90"
                    />
                  </div>
                  <span className="text-sm font-medium text-zinc-100 text-right truncate flex-1">
                    {team.roster?.[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

