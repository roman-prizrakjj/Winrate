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

    const matches: Match[] = [];
    let page = 0;
    const limit = 100; // Пагинация по 100 матчей
    let hasMore = true;

    while (hasMore) {
      console.log(`[Matches Service] Загрузка страницы ${page}...`);

      const result = await db.getRows({
        limit,
        page,
        useHumanReadableNames: true, // Загружаем вложенные tournament, tour, teams
        // @ts-ignore
        cache: 'no-store', // Отключаем fetch cache для серверных компонентов
      });

      // Проверка на ошибку или пустой результат
      if (!Array.isArray(result) || result.length === 0) {
        console.log('[Matches Service] Больше матчей нет');
        hasMore = false;
        break;
      }

      console.log(`[Matches Service] Загружено матчей на странице ${page}: ${result.length}`);
      
      matches.push(...(result as Match[]));
      page++;

      // Если получили меньше чем limit, значит это последняя страница
      if (result.length < limit) {
        hasMore = false;
      }

      // Защита от бесконечного цикла
      if (page > 100) {
        console.warn('[Matches Service] Достигнут лимит страниц (100), прерывание');
        break;
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
