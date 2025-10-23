import React from 'react';

interface MatchStatsIndicatorProps {
  completed: number;
  inProgress: number;
  protests: number;
  activeFilter: 'completed' | 'inProgress' | 'protests' | null;
  onFilterChange: (filter: 'completed' | 'inProgress' | 'protests' | null) => void;
}

export const MatchStatsIndicator: React.FC<MatchStatsIndicatorProps> = ({
  completed,
  inProgress,
  protests,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Завершенные матчи */}
      <button
        onClick={() => onFilterChange(activeFilter === 'completed' ? null : 'completed')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          activeFilter === 'completed'
            ? 'bg-green-500/30 border-2 border-green-500'
            : 'bg-green-500/20 border border-green-500/30 hover:bg-green-500/25'
        }`}
      >
        <span className="text-sm text-gray-300">Завершено:</span>
        <span className="text-lg font-bold text-green-400">{completed}</span>
      </button>

      {/* Матчи в процессе */}
      <button
        onClick={() => onFilterChange(activeFilter === 'inProgress' ? null : 'inProgress')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          activeFilter === 'inProgress'
            ? 'bg-blue-500/30 border-2 border-blue-500'
            : 'bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/25'
        }`}
      >
        <span className="text-sm text-gray-300">В процессе:</span>
        <span className="text-lg font-bold text-blue-400">{inProgress}</span>
      </button>

      {/* Протесты */}
      <button
        onClick={() => onFilterChange(activeFilter === 'protests' ? null : 'protests')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          activeFilter === 'protests'
            ? 'bg-red-500/30 border-2 border-red-500'
            : 'bg-red-500/20 border border-red-500/30 hover:bg-red-500/25'
        }`}
      >
        <span className="text-sm text-gray-300">Протесты:</span>
        <span className="text-lg font-bold text-red-400">{protests}</span>
      </button>
    </div>
  );
};
