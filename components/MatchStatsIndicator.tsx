import React from 'react';

interface MatchStatsIndicatorProps {
  completed: number;
  inProgress: number;
  protests: number;
}

export const MatchStatsIndicator: React.FC<MatchStatsIndicatorProps> = ({
  completed,
  inProgress,
  protests,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Завершенные матчи */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
        <span className="text-sm text-gray-300">Завершено:</span>
        <span className="text-lg font-bold text-green-400">{completed}</span>
      </div>

      {/* Матчи в процессе */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <span className="text-sm text-gray-300">В процессе:</span>
        <span className="text-lg font-bold text-blue-400">{inProgress}</span>
      </div>

      {/* Протесты */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg">
        <span className="text-sm text-gray-300">Протесты:</span>
        <span className="text-lg font-bold text-red-400">{protests}</span>
      </div>
    </div>
  );
};
