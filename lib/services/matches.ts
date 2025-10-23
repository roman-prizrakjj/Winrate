/**
 * Сервис для работы с матчами через @emd-cloud/sdk
 */

import { EmdCloud, AppEnvironment, AuthType } from '@emd-cloud/sdk';
import type { Match } from '@/lib/types/matches';

/**
 * Инициализация SDK клиента
 */
function createSDKClient() {
  return new EmdCloud({
    environment: AppEnvironment.Server,
    appId: process.env.EMD_APP_ID!,
    apiToken: process.env.EMD_API_TOKEN!,
    defaultAuthType: AuthType.ApiToken,
  });
}

/**
 * Загрузка страниц данных батчами с контролем параллелизма
 * @param db - Database instance
 * @param totalPages - Общее количество страниц
 * @param limit - Размер страницы
 * @param parallelLimit - Лимит параллельных запросов
 */
async function fetchPagesInBatches(
  db: any,
  totalPages: number,
  limit: number,
  parallelLimit: number
): Promise<Match[]> {
  const allMatches: Match[] = [];
  
  // Разбиваем страницы на батчи
  for (let batchStart = 0; batchStart < totalPages; batchStart += parallelLimit) {
    const batchEnd = Math.min(batchStart + parallelLimit, totalPages);
    const batchSize = batchEnd - batchStart;
    
    console.log(`[Matches Service] Загрузка батча ${Math.floor(batchStart / parallelLimit) + 1}: страницы ${batchStart}-${batchEnd - 1} (${batchSize} запросов)`);
    
    // Создаем массив промисов для текущего батча
    const batchPromises = Array.from({ length: batchSize }, (_, index) => {
      const page = batchStart + index;
      return db.getRows({
        limit,
        page,
        useHumanReadableNames: true,
        // @ts-ignore
        cache: 'no-store',
      });
    });
    
    // Выполняем все запросы батча параллельно
    const batchResults = await Promise.all(batchPromises);
    
    // Собираем результаты
    batchResults.forEach((result, index) => {
      if (Array.isArray(result) && result.length > 0) {
        allMatches.push(...(result as Match[]));
        console.log(`[Matches Service] Страница ${batchStart + index}: загружено ${result.length} матчей`);
      }
    });
  }
  
  return allMatches;
}

/**
 * Загрузка всех матчей
 * 
 * @returns Массив матчей с вложенными tournament, tour и teams
 */
export async function getAllMatches(): Promise<Match[]> {
  try {
    const matchesCollectionId = process.env.MATCHES_COLLECTION_ID;
    
    if (!matchesCollectionId) {
      throw new Error('MATCHES_COLLECTION_ID не настроен');
    }

    console.log('[Matches Service] Загрузка матчей из коллекции:', matchesCollectionId);

    const client = createSDKClient();
    const db = client.database(matchesCollectionId);

    // Конфигурация из ENV
    const pageSize = parseInt(process.env.PAGE_SIZE || '100', 10);
    const parallelLimit = parseInt(process.env.PARALLEL_REQUESTS_LIMIT || '5', 10);
    
    console.log(`[Matches Service] Конфигурация: PAGE_SIZE=${pageSize}, PARALLEL_REQUESTS_LIMIT=${parallelLimit}`);

    // Загружаем первую страницу чтобы узнать общее количество
    const firstPage = await db.getRows({
      limit: pageSize,
      page: 0,
      useHumanReadableNames: true,
      // @ts-ignore
      cache: 'no-store',
    });

    if (!Array.isArray(firstPage) || firstPage.length === 0) {
      console.log('[Matches Service] Матчей не найдено');
      return [];
    }

    const matches: Match[] = [...(firstPage as Match[])];
    console.log(`[Matches Service] Первая страница: загружено ${firstPage.length} матчей`);

    // Проверяем, есть ли еще страницы
    if (firstPage.length < pageSize) {
      console.log('[Matches Service] Все матчи загружены (одна страница)');
      return matches;
    }

    // Если параллельная загрузка отключена (parallelLimit <= 1), используем последовательную
    if (parallelLimit <= 1) {
      console.log('[Matches Service] Параллельная загрузка отключена, используем последовательную');
      
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
          break;
        }

        matches.push(...(result as Match[]));
        console.log(`[Matches Service] Страница ${page}: загружено ${result.length} матчей`);
        page++;

        if (result.length < pageSize) {
          hasMore = false;
        }

        // Защита от бесконечного цикла
        if (page > 100) {
          console.warn('[Matches Service] Достигнут лимит страниц (100), прерывание');
          break;
        }
      }
    } else {
      // Параллельная загрузка
      // Предполагаем, что может быть еще ~10 страниц (грубая оценка)
      // В реальности SDK может не возвращать total, поэтому делаем оптимистичную загрузку
      console.log('[Matches Service] Используем параллельную загрузку остальных страниц');
      
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const batchStart = page;
        const batchEnd = Math.min(page + parallelLimit, page + 20); // Ограничиваем 20 страницами за раз
        const batchSize = batchEnd - batchStart;
        
        console.log(`[Matches Service] Загрузка батча: страницы ${batchStart}-${batchEnd - 1}`);
        
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
            matches.push(...(result as Match[]));
            console.log(`[Matches Service] Страница ${batchStart + index}: загружено ${result.length} матчей`);
            
            // Если страница неполная, значит это последняя
            if (result.length < pageSize) {
              hasMore = false;
            }
          } else {
            emptyPagesCount++;
          }
        });
        
        // Если все страницы в батче пустые, останавливаемся
        if (emptyPagesCount === batchSize) {
          hasMore = false;
        }
        
        page = batchEnd;
        
        // Защита от бесконечного цикла
        if (page > 100) {
          console.warn('[Matches Service] Достигнут лимит страниц (100), прерывание');
          break;
        }
      }
    }

    console.log(`[Matches Service] Всего загружено матчей: ${matches.length}`);
    
    return matches;
    
  } catch (error) {
    console.error('[Matches Service] Ошибка загрузки матчей:', error);
    throw error;
  }
}

/**
 * Получить матч по ID
 * 
 * @param matchId - ID матча
 * @returns Матч с полными данными
 */
export async function getMatchById(matchId: string): Promise<Match | null> {
  try {
    const matchesCollectionId = process.env.MATCHES_COLLECTION_ID;
    
    if (!matchesCollectionId) {
      throw new Error('MATCHES_COLLECTION_ID не настроен');
    }

    console.log('[Matches Service] Загрузка матча:', matchId);

    const client = createSDKClient();
    const db = client.database(matchesCollectionId);

    const result = await db.getRow(matchId, {
      useHumanReadableNames: true,
    });

    if (!result) {
      console.warn('[Matches Service] Матч не найден:', matchId);
      return null;
    }

    return result as Match;
    
  } catch (error) {
    console.error('[Matches Service] Ошибка загрузки матча:', error);
    return null;
  }
}
