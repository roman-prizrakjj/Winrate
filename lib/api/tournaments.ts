// API функции для работы с турнирами

export interface Tournament {
  _id: string;
  title: string;
}

// Кэш для турниров
let tournamentsCache: Tournament[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получает список турниров из API с кэшированием
 * Кэш действует 5 минут, затем данные обновляются
 * При ошибке возвращает старый кэш или пустой массив
 */
export async function getTournaments(): Promise<Tournament[]> {
  const now = Date.now();
  
  // Проверяем кэш
  if (tournamentsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('✅ Турниры из кэша');
    return tournamentsCache;
  }

  try {
    console.log('🔄 Загружаем турниры из API...');
    const response = await fetch('/api/tournaments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Tournament[] = await response.json();
    
    // Сохраняем в кэш
    tournamentsCache = data;
    cacheTimestamp = now;
    
    console.log(`✅ Загружено турниров: ${data.length}`);
    return data;
  } catch (error) {
    console.error('❌ Ошибка загрузки турниров:', error);
    
    // Возвращаем старый кэш, если есть
    if (tournamentsCache) {
      console.log('⚠️ Используем устаревший кэш');
      return tournamentsCache;
    }
    
    return [];
  }
}

/**
 * Очищает кэш турниров (для принудительного обновления)
 */
export function clearTournamentsCache(): void {
  tournamentsCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ Кэш турниров очищен');
}
