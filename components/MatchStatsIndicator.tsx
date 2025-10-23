import React from 'react';

interface MatchStatsIndicatorProps {
  completed: number;
  inProgress: number;
  protests: number;
  // Детальная статистика
  waiting: number;
  playing: number;
  waitingConfirmation: number;
  activeFilter: 'completed' | 'inProgress' | 'protests' | 
                'waiting' | 'playing' | 'waitingConfirmation' | 
                null;
  onFilterChange: (filter: 'completed' | 'inProgress' | 'protests' | 
                           'waiting' | 'playing' | 'waitingConfirmation' | 
                           null) => void;
}

export const MatchStatsIndicator: React.FC<MatchStatsIndicatorProps> = ({
  completed,
  inProgress,
  protests,
  waiting,
  playing,
  waitingConfirmation,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Старые бейджи (группы) */}
      <div className="flex items-center justify-center gap-3">
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

      {/* Новые кнопки (детальные статусы) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Ожидание игры */}
        <button
          onClick={() => onFilterChange(activeFilter === 'waiting' ? null : 'waiting')}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-sm transition-all ${
            activeFilter === 'waiting'
              ? 'bg-gray-500/30 border-2 border-gray-500'
              : 'bg-gray-500/10 border border-gray-500/30 hover:bg-gray-500/20'
          }`}
        >
          <span className="text-gray-300">Ожидание игры:</span>
          <span className="font-bold text-gray-400">{waiting}</span>
        </button>

        {/* Идёт игра */}
        <button
          onClick={() => onFilterChange(activeFilter === 'playing' ? null : 'playing')}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-sm transition-all ${
            activeFilter === 'playing'
              ? 'bg-blue-500/30 border-2 border-blue-500'
              : 'bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20'
          }`}
        >
          <span className="text-gray-300">Идёт игра:</span>
          <span className="font-bold text-blue-400">{playing}</span>
        </button>

        {/* Ожидание подтверждения */}
        <button
          onClick={() => onFilterChange(activeFilter === 'waitingConfirmation' ? null : 'waitingConfirmation')}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-sm transition-all ${
            activeFilter === 'waitingConfirmation'
              ? 'bg-yellow-500/30 border-2 border-yellow-500'
              : 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20'
          }`}
        >
          <span className="text-gray-300">Ожидание подтверждения:</span>
          <span className="font-bold text-yellow-400">{waitingConfirmation}</span>
        </button>
      </div>
    </div>
  );
};
