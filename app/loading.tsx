import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-4">
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

      {/* Minimalist Loading Label */}
      <div className="mt-5 flex items-center gap-2 text-zinc-400 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span>Cargando Simulador...</span>
      </div>
    </div>
  );
}
