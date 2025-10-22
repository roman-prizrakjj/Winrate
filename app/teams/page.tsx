import Header from '@/components/Header';
import TeamsPageClient from './TeamsPageClient';
import { getAllTeamsWithPlayers } from '@/lib/services/teams';

// ISR: кеш на время из .env (по умолчанию 10 минут)
export const revalidate = parseInt(process.env.REVALIDATE_TIME || '600', 10);

/**
 * Загрузка команд через SDK напрямую (без API route)
 */
async function getTeams() {
  try {
    console.log('[Teams Page] Загрузка команд через SDK...');
    
    // Прямой вызов SDK сервиса - возвращаем данные напрямую без адаптера
    const teams = await getAllTeamsWithPlayers();
    
    console.log(`[Teams Page] Загружено команд: ${teams.length}`);
    
    return teams;
  } catch (error) {
    console.error('[Teams Page] Ошибка:', error);
    return [];
  }
}

export default async function TeamsPage() {
  console.log(`[${new Date().toISOString()}] [Teams ISR] Регенерация страницы...`);
  
  // Загружаем команды на сервере
  const allTeams = await getTeams();

  // Debug: логируем количество команд
  console.log(`[Teams Page Server] Отрисовка с ${allTeams.length} командами`);

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