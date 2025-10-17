// API функции для работы со статистикой команд

export interface TeamStatsResponse {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  i: number;
  cb: number;      // Коэффициент Бухгольца
  s: number;       // Очки (score)
  stage?: string;  // Название этапа турнира
  tournamentTeamId?: string;
}

// Кэш для статистики команд
let teamStatsCache: TeamStatsResponse[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получает статистику команд из API с кэшированием
 * Кэш действует 5 минут, затем данные обновляются
 * При ошибке возвращает старый кэш или пустой массив
 */
export async function getTeamStats(): Promise<TeamStatsResponse[]> {
  const now = Date.now();
  
  // Проверяем кэш
  if (teamStatsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('✅ Статистика команд из кэша');
    return teamStatsCache;
  }

  try {
    console.log('🔄 Загружаем статистику команд из API...');
    const response = await fetch('/api/team-stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeamStatsResponse[] = await response.json();
    
    // Сохраняем в кэш
    teamStatsCache = data;
    cacheTimestamp = now;
    
    console.log(`✅ Загружено записей статистики: ${data.length}`);
    return data;
  } catch (error) {
    console.error('❌ Ошибка загрузки статистики команд:', error);
    
    // Возвращаем старый кэш, если есть
    if (teamStatsCache) {
      console.log('⚠️ Используем устаревший кэш');
      return teamStatsCache;
    }
    
    return [];
  }
}

/**
 * Очищает кэш статистики команд (для принудительного обновления)
 */
export function clearTeamStatsCache(): void {
  teamStatsCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ Кэш статистики команд очищен');
}
