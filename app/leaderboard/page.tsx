import Header from "@/components/Header";
import LeaderboardClient from "./LeaderboardClient";
import { TeamStats } from "@/components/TeamStatsTable";
import { emdCloud, COLLECTIONS } from '@/lib/emd-cloud';

// ISR: кеш на время из .env (по умолчанию 10 минут)
export const revalidate = parseInt(process.env.REVALIDATE_TIME || '600', 10);

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
async function getLeaderboardData(): Promise<{
  teams: TeamStats[];
  tournaments: Array<{ id: string; title: string; stageTitle: string; stageStatus: string }>;
}> {
  try {
    if (!COLLECTIONS.TEAM_STATS) {
      console.error('[Leaderboard] TEAM_STATS_COLLECTION_ID не установлен');
      return { teams: [], tournaments: [] };
    }

    console.log('[Leaderboard] Загрузка статистики через SDK...');
    
    const db = emdCloud.database(COLLECTIONS.TEAM_STATS);

    // Конфигурация из ENV
    const pageSize = parseInt(process.env.PAGE_SIZE || '100', 10);
    const parallelLimit = parseInt(process.env.PARALLEL_REQUESTS_LIMIT || '5', 10);
    
    console.log(`[Leaderboard] Конфигурация: PAGE_SIZE=${pageSize}, PARALLEL_REQUESTS_LIMIT=${parallelLimit}`);

    // Загружаем первую страницу
    const firstPage = await db.getRows({
      limit: pageSize,
      page: 0,
      useHumanReadableNames: true,
      // @ts-ignore
      cache: 'no-store',
    });

    if (!Array.isArray(firstPage) || firstPage.length === 0) {
      console.log('[Leaderboard] Записей не найдено');
      return { teams: [], tournaments: [] };
    }

    const allRows: any[] = [...firstPage];
    console.log(`[Leaderboard] Первая страница: загружено ${firstPage.length} записей`);

    // Если одна страница содержит все данные
    if (firstPage.length < pageSize) {
      console.log('[Leaderboard] Все записи загружены (одна страница)');
    } else if (parallelLimit <= 1) {
      // Последовательная загрузка
      console.log('[Leaderboard] Параллельная загрузка отключена, используем последовательную');
      
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await db.getRows({
          limit: pageSize,
          page,
          useHumanReadableNames: true,
          // @ts-ignore
          cache: 'no-store',
        });

        if (!Array.isArray(result) || result.length === 0) {
          hasMore = false;
        } else {
          allRows.push(...result);
          console.log(`[Leaderboard] Страница ${page}: загружено ${result.length} записей`);
          page++;
          
          if (result.length < pageSize) {
            hasMore = false;
          }
        }

        if (page > 100) {
          console.warn('[Leaderboard] Достигнут лимит страниц (100), прерывание');
          break;
        }
      }
    } else {
      // Параллельная загрузка
      console.log('[Leaderboard] Используем параллельную загрузку остальных страниц');
      
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const batchStart = page;
        const batchEnd = Math.min(page + parallelLimit, page + 20);
        const batchSize = batchEnd - batchStart;
        
        console.log(`[Leaderboard] Загрузка батча: страницы ${batchStart}-${batchEnd - 1}`);
        
        const batchPromises = Array.from({ length: batchSize }, (_, index) => {
          const currentPage = batchStart + index;
          return db.getRows({
            limit: pageSize,
            page: currentPage,
            useHumanReadableNames: true,
            // @ts-ignore
            cache: 'no-store',
          });
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        let emptyPagesCount = 0;
        batchResults.forEach((result, index) => {
          if (Array.isArray(result) && result.length > 0) {
            allRows.push(...result);
            console.log(`[Leaderboard] Страница ${batchStart + index}: загружено ${result.length} записей`);
            
            if (result.length < pageSize) {
              hasMore = false;
            }
          } else {
            emptyPagesCount++;
          }
        });
        
        if (emptyPagesCount === batchSize) {
          hasMore = false;
        }
        
        page = batchEnd;
        
        if (page > 100) {
          console.warn('[Leaderboard] Достигнут лимит страниц (100), прерывание');
          break;
        }
      }
    }

    console.log(`[Leaderboard] Загружено записей: ${allRows.length}`);

    // Собираем уникальные турниры
    const tournamentsMap = new Map<string, { id: string; title: string; stageTitle: string; stageStatus: string }>();
    
    allRows.forEach((row: any) => {
      const tournamentData = row.data?.tournament;
      const stageData = row.data?.stage;
      
      if (tournamentData?._id && !tournamentsMap.has(tournamentData._id)) {
        tournamentsMap.set(tournamentData._id, {
          id: tournamentData._id,
          title: tournamentData.data?.title || 'Без названия',
          stageTitle: stageData?.data?.title || 'Без этапа',
          stageStatus: stageData?.data?.status || ''
        });
      }
    });

    // Преобразуем данные
    const teamsWithStats: TeamStats[] = allRows.map((row: any) => {
      const data = row.data || {};
      const wins = data.win || 0;
      const losses = data.loss || 0;
      const technicalLoss = data.technical_loss || 0;
      const draws = 0; // Нет в структуре данных
      const gamesPlayed = wins + losses + technicalLoss;
      const winrate = gamesPlayed > 0 
        ? Math.round((wins / gamesPlayed) * 100) 
        : 0;

      return {
        id: row._id,
        position: 0, // Установим после сортировки
        name: data.team?.data?.name || 'Неизвестная команда',
        tournamentId: data.tournament?._id || null,
        wins,
        losses,
        draws: technicalLoss,
        i: 0, // Нет в структуре данных
        cb: data.buchholz || 0,
        s: data.score || 0,
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
    
    const tournaments = Array.from(tournamentsMap.values());
    
    return { teams: teamsWithStats, tournaments };

  } catch (error) {
    console.error('[Leaderboard] Ошибка загрузки:', error);
    return { teams: [], tournaments: [] };
  }
}

export default async function LeaderboardPage() {
  console.log(`[${new Date().toISOString()}] [Leaderboard ISR] Регенерация страницы...`);
  
  // Загружаем данные на сервере
  const { teams, tournaments } = await getLeaderboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Header activeTab="leaderboard" />
        </div>

        {/* Клиентская часть с таблицей */}
        <LeaderboardClient teams={teams} tournaments={tournaments} />
      </div>
    </div>
  );
}