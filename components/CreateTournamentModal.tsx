'use client';

import { useState } from 'react';
import { createTournament } from '@/app/actions/tournament';
import { TOURNAMENT_STATUSES } from '@/lib/statuses';
import { DIVISIONS } from '@/lib/divisions';
import { DISCIPLINES } from '@/lib/disciplines';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTournamentModal({ isOpen, onClose }: CreateTournamentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createTournament(formData);

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
          <h2 className="text-2xl font-bold text-white">Создать турнир</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Название турнира <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={200}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
              placeholder="Введите название турнира"
            />
          </div>

          {/* Статус */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Статус <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              defaultValue={TOURNAMENT_STATUSES[0].id}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            >
              {TOURNAMENT_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Дисциплина */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Дисциплина <span className="text-red-500">*</span>
            </label>
            <select
              name="discipline"
              required
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            >
              <option value="">Выберите дисциплину</option>
              {DISCIPLINES.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.displayName || discipline.icon}
                </option>
              ))}
            </select>
          </div>

          {/* Дивизион */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Дивизион <span className="text-red-500">*</span>
            </label>
            <select
              name="division"
              required
              defaultValue={DIVISIONS[0].id}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none"
            >
              {DIVISIONS.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Описание
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none resize-none"
              placeholder="Введите описание турнира"
            />
          </div>

          {/* Правила */}
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Правила
            </label>
            <textarea
              name="rules"
              rows={3}
              className="w-full px-4 py-2 bg-[#1A1F2E] text-white rounded-lg border border-white/10 focus:border-[#2581FF] focus:outline-none resize-none"
              placeholder="Введите правила турнира"
            />
          </div>

          {/* Чекбоксы */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-white/70 cursor-pointer">
              <input
                type="checkbox"
                name="has_fastcup"
                value="true"
                className="w-4 h-4 rounded border-white/10 bg-[#1A1F2E] text-[#2581FF] focus:ring-[#2581FF]"
              />
              Быстрый турнир
            </label>

            <label className="flex items-center gap-2 text-white/70 cursor-pointer">
              <input
                type="checkbox"
                name="showOnPlatform"
                value="true"
                className="w-4 h-4 rounded border-white/10 bg-[#1A1F2E] text-[#2581FF] focus:ring-[#2581FF]"
              />
              Показывать на платформе
            </label>
          </div>

          {/* Сообщения об ошибках/успехе */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg">
              ✅ Турнир успешно создан!
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#2581FF] text-white rounded-lg hover:bg-[#2581FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать турнир'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
