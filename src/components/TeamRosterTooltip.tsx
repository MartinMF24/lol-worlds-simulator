'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Team } from '../types/swiss';

// Lazy-load the popover content so the 80+ tooltips don't bloat the initial bundle
const TeamRosterPopover = dynamic(
  () => import('./TeamRosterPopover').then((mod) => mod.TeamRosterPopover),
  { ssr: false }
);

interface TeamRosterTooltipProps {
  team: Team;
  children: React.ReactNode;
  className?: string;
}

export const TeamRosterTooltip: React.FC<TeamRosterTooltipProps> = memo(({
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
          <TeamRosterPopover team={team} coords={coords} />,
          document.body
        )}
    </div>
  );
});

TeamRosterTooltip.displayName = 'TeamRosterTooltip';

