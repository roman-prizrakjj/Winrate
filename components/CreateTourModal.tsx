'use client';

import { useState, useEffect } from 'react';
import { createTour } from '@/app/actions/tour';
import type { TournamentOption, StageOption } from '@/lib/types/tour';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTourModal({ isOpen, onClose }: CreateTourModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Состояние для списка турниров
  const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [tournamentsError, setTournamentsError] = useState<string | null>(null);

  // Состояние для списка этапов
  const [stages, setStages] = useState<StageOption[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [stagesError, setStagesError] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');

  // Загрузка турниров при открытии модалки
  useEffect(() => {
    if (isOpen) {
      loadTournaments();
      // Сброс состояния при открытии
      setSelectedTournamentId('');
      setStages([]);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Загрузка этапов при выборе турнира
  useEffect(() => {
    if (selectedTournamentId) {
      loadStages(selectedTournamentId);
    } else {
      setStages([]);
    }
  }, [selectedTournamentId]);

  const loadTournaments = async () => {
    setLoadingTournaments(true);
    setTournamentsError(null);
    
    try {
      const response = await fetch('/api/tournaments-list', {
        cache: 'no-store' // 🔥 Всегда загружаем свежие данные
      });
      if (!response.ok) {
        throw new Error('Не удалось загрузить турниры');
      }
      
      const data = await response.json();
      setTournaments(data);
      
      if (data.length === 0) {
        setTournamentsError('Нет доступных турниров. Создайте турнир сначала.');
      }
    } catch (err) {
      setTournamentsError(err instanceof Error ? err.message : 'Ошибка загрузки турниров');
    } finally {
      setLoadingTournaments(false);
    }
  };

  const loadStages = async (tournamentId: string) => {
    setLoadingStages(true);
    setStagesError(null);
    
    try {
      const response = await fetch(`/api/stages-list?tournamentId=${tournamentId}`, {
        cache: 'no-store' // 🔥 Всегда загружаем свежие данные
      });
      if (!response.ok) {
        throw new Error('Не удалось загрузить этапы');
      }
      
      const data = await response.json();
      setStages(data);
      
      if (data.length === 0) {
        setStagesError('У выбранного турнира нет этапов. Создайте этап сначала.');
      }
    } catch (err) {
      setStagesError(err instanceof Error ? err.message : 'Ошибка загрузки этапов');
    } finally {
      setLoadingStages(false);
    }
  };

  const handleTournamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTournamentId(e.target.value);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createTour(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } else {
      setError(result.error || 'Произошла ошибка');
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282E3B] rounded-[10px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Создать тур</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор турнира */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Турнир <span className="text-red-500">*</span>
            </label>
            {loadingTournaments ? (
              <div className="w-full px-4 py-2 bg-[#1A1F2E] text-white/50 rounded-lg border border-white/10">
                Загрузка турниров...
              </div>
            ) : tournamentsError ? (
              <div className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                {tournamentsError}
              </div>
            ) : (
              <select
                name="tournament"
                required
                disabled={tournaments.length === 0}
                value={selectedTournamentId}
                onChange={handleTournamentChange}
                className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none disabled:opacity-50"
              >
                <option value="">Выберите турнир</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Выбор этапа */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Этап <span className="text-red-500">*</span>
            </label>
            {!selectedTournamentId ? (
              <div className="w-full px-4 py-2 bg-[#1A1F2E] text-white/50 rounded-lg border border-white/10">
                Сначала выберите турнир
              </div>
            ) : loadingStages ? (
              <div className="w-full px-4 py-2 bg-[#1A1F2E] text-white/50 rounded-lg border border-white/10">
                Загрузка этапов...
              </div>
            ) : stagesError ? (
              <div className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                {stagesError}
              </div>
            ) : (
              <select
                name="stage"
                required
                disabled={stages.length === 0}
                className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none disabled:opacity-50"
              >
                <option value="">Выберите этап</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title} (Этап {stage.order})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Название тура */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Название тура <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Например: 1 тур"
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none placeholder:text-white/30"
            />
          </div>

          {/* Порядковый номер */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Порядковый номер <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="order"
              required
              min="1"
              defaultValue="1"
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            />
          </div>

          {/* Дата и время начала */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Дата и время начала <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="dateStart"
              required
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none [color-scheme:dark]"
            />
          </div>

          {/* Дата и время окончания */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Дата и время окончания <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="dateEnd"
              required
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none [color-scheme:dark]"
            />
          </div>

          {/* Сообщения */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
              ✓ Тур успешно создан!
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || tournaments.length === 0 || (!!selectedTournamentId && stages.length === 0)}
              className="flex-1 px-6 py-3 bg-[#2581FF] hover:bg-[#1a6edb] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Создание...' : 'Создать тур'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
