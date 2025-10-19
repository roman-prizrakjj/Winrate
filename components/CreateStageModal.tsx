'use client';

import { useState, useEffect } from 'react';
import { createStage } from '@/app/actions/stage';
import { STAGE_STATUSES, DEFAULT_STAGE_STATUS_ID } from '@/lib/stage-statuses';
import { STAGE_MECHANICS, DEFAULT_MECHANIC_ID } from '@/lib/stage-mechanics';
import type { TournamentOption } from '@/lib/types/stage';

interface CreateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStageModal({ isOpen, onClose }: CreateStageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Состояние для списка турниров
  const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [tournamentsError, setTournamentsError] = useState<string | null>(null);

  // Загрузка турниров при открытии модалки
  useEffect(() => {
    if (isOpen) {
      loadTournaments();
    }
  }, [isOpen]);

  const loadTournaments = async () => {
    setLoadingTournaments(true);
    setTournamentsError(null);
    
    try {
      const response = await fetch('/api/tournaments-list');
      if (!response.ok) {
        throw new Error('Не удалось загрузить турниры');
      }
      
      const data = await response.json();
      setTournaments(data);
      
      if (data.length === 0) {
        setTournamentsError('Нет доступных турниров. Создайте турнир сначала.');
      }
    } catch (err) {
      setTournamentsError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoadingTournaments(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createStage(formData);

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
          <h2 className="text-2xl font-bold text-white">Создать этап турнира</h2>
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

          {/* Название этапа */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Название этапа <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={200}
              placeholder="Например: Групповой этап, Плей-офф, Финал"
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            />
          </div>

          {/* Механика */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Механика проведения <span className="text-red-500">*</span>
            </label>
            <select
              name="mechanic"
              required
              defaultValue={DEFAULT_MECHANIC_ID}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            >
              {STAGE_MECHANICS.map((mechanic) => (
                <option key={mechanic.id} value={mechanic.id} title={mechanic.description}>
                  {mechanic.displayName}
                </option>
              ))}
            </select>
            <p className="text-white/40 text-xs mt-1">
              {STAGE_MECHANICS.find(m => m.id === DEFAULT_MECHANIC_ID)?.description}
            </p>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Статус <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              defaultValue={DEFAULT_STAGE_STATUS_ID}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            >
              {STAGE_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.displayName}
                </option>
              ))}
            </select>
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
            <p className="text-white/40 text-xs mt-1">
              Определяет последовательность этапов в турнире (1, 2, 3...)
            </p>
          </div>

          {/* Сообщения об ошибках/успехе */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
              ✅ Этап успешно создан!
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading || loadingTournaments || tournaments.length === 0}
              className="flex-1 px-6 py-3 bg-[#2581FF] text-white rounded-lg hover:bg-[#1a5ec9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Создание...' : 'Создать этап'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
