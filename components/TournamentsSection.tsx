'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Tournament } from '@/lib/types/tournaments';
import TournamentList from './TournamentList';

interface TournamentsSectionProps {
  tournaments: Tournament[];
}

export default function TournamentsSection({ tournaments }: TournamentsSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Обновление данных турниров
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

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">
            Турниры
          </h2>
          <div className="text-sm text-gray-400">
            Всего: <span className="text-white font-semibold">{tournaments.length}</span>
          </div>
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
          title="Обновить список турниров"
        >
          <span className={isPending ? 'animate-spin' : ''}>
            {isPending ? '⏳' : '🔄'}
          </span>
          <span>{isPending ? 'Обновление...' : 'Обновить'}</span>
        </button>
      </div>

      <TournamentList tournaments={tournaments} />
    </section>
  );
}
