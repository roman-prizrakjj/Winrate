// Сервис для работы с турнирами через SDK

import { emdCloud } from '@/lib/emd-cloud';

/**
 * Задержка выполнения
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry с экспоненциальной задержкой
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries - 1;
      
      if (isLastAttempt) {
        console.error(`[Tournaments Retry] Все попытки исчерпаны (${retries})`);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`[Tournaments Retry] Попытка ${attempt + 1}/${retries} не удалась. Повтор через ${delay}ms...`);
      await sleep(delay);
    }
  }
  
  throw new Error('Unreachable');
}

/**
 * Получить все турниры с полной информацией
 */
export async function getAllTournaments() {
  try {
    const tournamentsCollectionId = process.env.TOURNAMENTS_COLLECTION_ID;
    
    if (!tournamentsCollectionId) {
      throw new Error('TOURNAMENTS_COLLECTION_ID не настроен');
    }

    const db = emdCloud.database(tournamentsCollectionId);
    const result: any = await fetchWithRetry(() => db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    }));

    const rows: any[] = Array.isArray(result) 
      ? result 
      : ('data' in result ? result.data : []);

    return rows;
  } catch (error) {
    console.error('Ошибка при загрузке турниров:', error);
    throw error;
  }
}
