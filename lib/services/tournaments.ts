// Сервис для работы с турнирами через SDK

import { emdCloud } from '@/lib/emd-cloud';

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
    const result: any = await db.getRows({
      limit: 100,
      page: 0,
      useHumanReadableNames: true
    });

    const rows: any[] = Array.isArray(result) 
      ? result 
      : ('data' in result ? result.data : []);

    return rows;
  } catch (error) {
    console.error('Ошибка при загрузке турниров:', error);
    throw error;
  }
}
