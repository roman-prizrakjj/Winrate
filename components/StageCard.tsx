'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Stage } from '@/lib/types/stages';
import { STAGE_STATUSES } from '@/lib/stage-statuses';
import { disciplines } from '@/lib/disciplines';
import { updateStageStatus } from '@/app/actions/update-stage-status';

interface StageCardProps {
  stage: Stage;
}

export default function StageCard({ stage }: StageCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(stage.statusId);
  const [error, setError] = useState<string | null>(null);

  // Получаем иконку дисциплины
  const disciplineInfo = Object.entries(disciplines).find(
    ([_, info]) => info.id === stage.disciplineId
  );
  const disciplineIcon = disciplineInfo?.[1].icon;

  // Получаем текущий статус
  const currentStatus = STAGE_STATUSES.find(s => s.id === selectedStatus);

  // Цвета для статусов
  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'start':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Обработчик смены статуса
  const handleStatusChange = async (newStatusId: string) => {
    // Оптимистичное обновление UI
    const previousStatus = selectedStatus;
    setSelectedStatus(newStatusId);
    setIsStatusDropdownOpen(false);
    setError(null);

    // Вызов Server Action в транзакции
    startTransition(async () => {
      const result = await updateStageStatus(stage.id, newStatusId);

      if (result.success) {
        // Обновляем ISR кеш
        router.refresh();
      } else {
        // Откатываем изменения при ошибке
        setSelectedStatus(previousStatus);
        setError(result.error || 'Не удалось обновить статус');
        console.error('Ошибка обновления статуса:', result.error);
      }
    });
  };

  // Форматирование даты
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="
      flex items-center gap-4 p-4
      w-full bg-[#3A4153] border border-[#4A5568] rounded-[10px]
      relative shadow-lg hover:border-[#5A6578] transition-colors
    ">
      {/* 1. Порядковый номер */}
      <div className="flex-shrink-0 w-12">
        <span className="text-white/70 text-sm font-bold">
          #{stage.order}
        </span>
      </div>

      {/* 2. Название этапа */}
      <div className="flex-shrink-0 w-32">
        <span className="text-white text-sm font-semibold">
          {stage.title}
        </span>
      </div>

      {/* 3. Турнир */}
      <div className="flex-1 min-w-0">
        <span className="text-gray-300 text-xs truncate block">
          🏆 {stage.tournamentTitle}
        </span>
      </div>

      {/* 4. Дисциплина */}
      <div className="flex-shrink-0 w-10">
        {disciplineIcon ? (
          <img 
            src={disciplineIcon} 
            alt={stage.disciplineName}
            className="w-6 h-6"
            title={stage.disciplineName}
          />
        ) : (
          <span className="text-xs text-gray-400">🎮</span>
        )}
      </div>

      {/* 5. Механика */}
      <div className="flex-shrink-0 w-40">
        <span className="text-gray-300 text-xs">
          {stage.mechanicName}
        </span>
      </div>

      {/* 6. Текущий тур */}
      <div className="flex-shrink-0 w-48">
        {stage.currentTour ? (
          <div className="flex flex-col gap-1">
            <span className="text-white text-xs font-medium">
              {stage.currentTour.title}
            </span>
            <span className="text-gray-400 text-[10px]">
              {formatDate(stage.currentTour.dateStart)}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 text-xs">-</span>
        )}
      </div>

      {/* 7. Команды */}
      <div className="flex-shrink-0 w-16">
        <span className={`
          px-2 py-1 rounded text-xs font-medium
          ${stage.teamsCount > 0 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }
        `}>
          {stage.teamsCount}
        </span>
      </div>

      {/* 8. Статус - кнопка с dropdown */}
      <div className="flex-shrink-0 w-40 relative">
        <button
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          disabled={isPending}
          className={`
            w-full px-3 py-2 rounded-lg text-xs font-medium
            border transition-all
            ${getStatusColor(currentStatus?.name || '')}
            hover:opacity-80 flex items-center justify-between
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span className="flex items-center gap-1">
            {isPending && <span className="animate-spin">⏳</span>}
            {currentStatus?.displayName || 'Неизвестно'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="absolute top-full right-0 mt-1 w-48 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs z-50">
            {error}
          </div>
        )}

        {/* Dropdown меню */}
        {isStatusDropdownOpen && (
          <div className="
            absolute top-full right-0 mt-1 w-48
            bg-[#282E3B] border border-[#4A5568] rounded-lg
            shadow-xl z-50 overflow-hidden
          ">
            {STAGE_STATUSES.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusChange(status.id)}
                className={`
                  w-full px-4 py-2 text-left text-xs
                  hover:bg-white/5 transition-colors
                  ${status.id === selectedStatus ? 'bg-white/10' : ''}
                  ${getStatusColor(status.name).split(' ').slice(1).join(' ')}
                `}
              >
                {status.displayName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Закрытие dropdown при клике вне */}
      {isStatusDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsStatusDropdownOpen(false)}
        />
      )}
    </div>
  );
}
