'use client';

import React from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  message = 'Preparando el torneo...',
}) => {
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Central Logo Container with subtle pulse animation */}
      <div className="relative w-28 sm:w-36 h-28 sm:h-36 rounded-2xl overflow-hidden border border-zinc-750/80 bg-zinc-900 shadow-2xl p-3 flex items-center justify-center animate-pulse">
        <Image
          src="/assets/Worlds.jpg?v=2"
          alt="Worlds 2026"
          width={160}
          height={160}
          className="w-full h-full object-contain rounded-xl"
          priority
        />
      </div>

      {/* Status indicator */}
      <div className="mt-5 flex items-center gap-2 text-zinc-400 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span>{message}</span>
      </div>
    </div>
  );
};
