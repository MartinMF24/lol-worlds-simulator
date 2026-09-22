import React from 'react';
import { Match } from '../types/swiss';
import { MatchCard } from './MatchCard';

interface RecordPoolGroupProps {
  poolRecord: string;
  matches: Match[];
  selectedWinners: Record<string, string>;
  isReadOnly?: boolean;
  onSelectWinner?: (matchId: string, winnerId: string) => void;
}

export const RecordPoolGroup: React.FC<RecordPoolGroupProps> = ({
  poolRecord,
  matches,
  selectedWinners,
  isReadOnly = false,
  onSelectWinner,
}) => {
  const [wins, losses] = poolRecord.split('-').map(Number);
  const isAdvancement = wins === 2 && losses < 2;
  const isElimination = losses === 2 && wins < 2;
  const isDecisive = wins === 2 && losses === 2;

  let contextText = '';
  let badgeStyle = 'bg-zinc-800/80 border-zinc-700 text-zinc-200';

  if (isAdvancement) {
    contextText = 'Pase a Playoffs';
    badgeStyle = 'bg-amber-400/10 border-amber-500/30 text-amber-300';
  } else if (isElimination) {
    contextText = 'Eliminación';
    badgeStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-300';
  } else if (isDecisive) {
    contextText = 'Decisivo';
    badgeStyle = 'bg-purple-500/10 border-purple-500/30 text-purple-300';
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Pool Header Badge */}
      <div className="flex items-center justify-between px-1">
        <span
          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeStyle}`}
        >
          Pool {poolRecord}
        </span>
        {contextText && (
          <span className="text-[10px] text-zinc-400 font-medium">
            {contextText}
          </span>
        )}
      </div>

      {/* Match Cards List */}
      <div className="space-y-1.5 w-full">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            selectedWinnerId={selectedWinners[match.id]}
            isReadOnly={isReadOnly}
            onSelectWinner={(winnerId) =>
              onSelectWinner && onSelectWinner(match.id, winnerId)
            }
          />
        ))}
      </div>
    </div>
  );
};
