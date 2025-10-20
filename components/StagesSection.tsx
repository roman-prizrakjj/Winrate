'use client';

import { useState, useMemo, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import StageList from '@/components/StageList';
import type { Stage } from '@/lib/types/stages';
import { STAGE_STATUSES } from '@/lib/stage-statuses';

interface StagesSectionProps {
  allStages: Stage[];
}

export default function StagesSection({ allStages }: StagesSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const stagesListRef = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Обработчик изменения фильтра турнира
  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournament(e.target.value);
    // Скроллим к началу списка этапов
    setTimeout(() => {
      stagesListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Обработчик изменения фильтра статуса
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    // Скроллим к началу списка этапов
    setTimeout(() => {
      stagesListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Обновление данных этапов
  // Универсальное решение: работает на Vercel (через API) и на других платформах (router.refresh)
  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        // Пытаемся вызвать API ревалидации (для Vercel и подобных платформ)
        const response = await fetch('/api/revalidate-create', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          console.log('[Refresh] Ревалидация через API успешна');
        } else {
          console.warn('[Refresh] API ревалидации вернул ошибку, используем fallback');
        }
      } catch (error) {
        // Если API недоступен (например, на self-hosted) - не проблема
        console.log('[Refresh] API недоступен, используем router.refresh() (нормально для non-Vercel)');
      } finally {
        // В любом случае вызываем router.refresh() - это работает на всех платформах
        router.refresh();
      }
    });
  };

  // Получаем уникальные турниры для фильтра
  const tournaments = useMemo(() => {
    const uniqueTournaments = new Map<string, string>();
    allStages.forEach(stage => {
      if (!uniqueTournaments.has(stage.tournamentId)) {
        uniqueTournaments.set(stage.tournamentId, stage.tournamentTitle);
      }
    });
    return Array.from(uniqueTournaments.entries()).map(([id, title]) => ({ id, title }));
  }, [allStages]);

  // Фильтрация этапов
  const filteredStages = useMemo(() => {
    let filtered = allStages;

    // Поиск по названию этапа или турниру
    if (searchTerm.trim()) {
      filtered = filtered.filter(stage =>
        stage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.tournamentTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по турниру
    if (selectedTournament !== 'all') {
      filtered = filtered.filter(stage => stage.tournamentId === selectedTournament);
    }

    // Фильтр по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(stage => stage.statusId === selectedStatus);
    }

    // Сортировка по порядковому номеру
    return filtered.sort((a, b) => a.order - b.order);
  }, [allStages, searchTerm, selectedTournament, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Этапы турниров
          </h2>
          <p className="text-white/60">
            Просмотр и управление этапами турниров
          </p>
        </div>

        {/* Поле поиска */}
        <div className="flex justify-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Поиск по названию этапа или турниру..."
            className="w-full max-w-md"
          />
        </div>

        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          {/* Фильтр по турниру */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <label className="text-white/80 text-[14px] font-medium whitespace-nowrap">
              Турнир:
            </label>
            <select
              value={selectedTournament}
              onChange={handleTournamentChange}
              className="
                bg-[#282E3B] text-white border border-white/20 rounded-[8px]
                px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#2581FF]
                min-w-[200px]
              "
            >
              <option value="all">Все турниры</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.title}
                </option>
              ))}
            </select>
          </div>

          {/* Фильтр по статусу */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <label className="text-white/80 text-[14px] font-medium whitespace-nowrap">
              Статус:
            </label>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="
                bg-[#282E3B] text-white border border-white/20 rounded-[8px]
                px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#2581FF]
                min-w-[180px]
              "
            >
              <option value="all">Все статусы</option>
              {STAGE_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Кнопка обновить */}
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="
              flex items-center gap-2 px-4 py-1.5 flex-shrink-0
              bg-[#2581FF] hover:bg-[#1a6edb] text-white
              rounded-[8px] text-[14px] font-medium whitespace-nowrap
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Обновить список этапов"
          >
            <span className={isPending ? 'animate-spin' : ''}>
              {isPending ? '⏳' : '🔄'}
            </span>
            <span>{isPending ? 'Обновление...' : 'Обновить'}</span>
          </button>
        </div>
      </div>

      {/* Список этапов */}
      <div ref={stagesListRef}>
        <StageList stages={filteredStages} />
      </div>

      {/* Статистика */}
      <div className="text-center text-white/50 text-sm">
        Показано этапов: {filteredStages.length} из {allStages.length}
      </div>
    </div>
  );
}
