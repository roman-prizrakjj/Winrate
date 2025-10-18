import Header from '@/components/Header';
import TeamsPageClient from './TeamsPageClient';
import { adaptTeams } from '@/lib/adapters/teams';
import type { TeamsResponse } from '@/lib/types/teams';

/**
 * Загрузка команд из API с кешированием
 */
async function getTeams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/teams`, {
      next: { revalidate: 600 }, // ISR: кеш на 10 минут
    });

    if (!response.ok) {
      console.error('[Teams Page] Ошибка загрузки:', response.statusText);
      return [];
    }

    const data: TeamsResponse = await response.json();
    console.log(`[Teams Page] Загружено команд: ${data.teams.length}`);
    
    // Преобразуем SDK данные в формат компонентов
    return adaptTeams(data.teams);
  } catch (error) {
    console.error('[Teams Page] Ошибка:', error);
    return [];
  }
}

export default async function TeamsPage() {
  // Загружаем команды на сервере
  const allTeams = await getTeams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок с навигацией */}
        <div className="mb-8">
          <Header activeTab="teams" />
        </div>
        
        {/* Клиентская часть с фильтрами и списком */}
        <TeamsPageClient allTeams={allTeams} />
      </div>
    </div>
  );
}