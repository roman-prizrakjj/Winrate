import Header from "@/components/Header";
import LeaderboardClient from "./LeaderboardClient";
import { TeamStats } from "@/components/TeamStatsTable";
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// ISR: кеш на 10 минут (600 секунд)
export const revalidate = 600;

interface TeamStatsResponse {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  i: number;
  cb: number;
  s: number;
}

/**
 * Загрузка статистики команд через SDK напрямую
 */
async function getLeaderboardData(): Promise<TeamStats[]> {
  try {
    if (!COLLECTIONS.TEAM_STATS) {
      console.error('[Leaderboard] TEAM_STATS_COLLECTION_ID не установлен');
      return [];
    }

    console.log('[Leaderboard] Загрузка статистики через SDK...');
    
    const db = emdCloud.database(COLLECTIONS.TEAM_STATS);

    // Загружаем все страницы с пагинацией
    const allRows: any[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await db.getRows({
        limit: 100,
        page: page,
        useHumanReadableNames: true,
        // @ts-ignore - Отключаем Next.js fetch cache для больших ответов
        cache: 'no-store',
      });

      if (!Array.isArray(result) || result.length === 0) {
        hasMore = false;
      } else {
        allRows.push(...result);
        page++;
        
        if (result.length < 100) {
          hasMore = false;
        }
      }
    }

    console.log(`[Leaderboard] Загружено записей: ${allRows.length}`);

    // Преобразуем данные
    const teamsWithStats: TeamStats[] = allRows.map((row: any) => {
      const data = row.data || {};
      const wins = data.wins || 0;
      const losses = data.losses || 0;
      const draws = data.draws || 0;
      const gamesPlayed = wins + losses;
      const winrate = gamesPlayed > 0 
        ? Math.round((wins / gamesPlayed) * 100) 
        : 0;

      return {
        id: row._id,
        position: 0, // Установим после сортировки
        name: data.name || 'Неизвестная команда',
        wins,
        losses,
        draws,
        i: data.i || 0,
        cb: data.cb || 0,
        s: data.s || 0,
        winrate
      };
    });

    // Сортируем по winrate → CB → S
    teamsWithStats.sort((a, b) => {
      if (b.winrate !== a.winrate) return b.winrate - a.winrate;
      if (b.cb !== a.cb) return b.cb - a.cb;
      return b.s - a.s;
    });

    // Устанавливаем позиции
    teamsWithStats.forEach((team, index) => {
      team.position = index + 1;
    });

    console.log(`[Leaderboard] Обработано команд: ${teamsWithStats.length}`);
    return teamsWithStats;

  } catch (error) {
    console.error('[Leaderboard] Ошибка загрузки:', error);
    return [];
  }
}

export default async function LeaderboardPage() {
  console.log(`[${new Date().toISOString()}] [Leaderboard ISR] Регенерация страницы...`);
  
  // Загружаем данные на сервере
  const teams = await getLeaderboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Header activeTab="leaderboard" />
        </div>

        {/* Клиентская часть с таблицей */}
        <LeaderboardClient teams={teams} />
      </div>
    </div>
  );
}