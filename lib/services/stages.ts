// Сервис для работы с этапами турниров через SDK

import { emdCloud } from '@/lib/emd-cloud';

/**
 * Получить все этапы турниров с полной информацией
 */
export async function getAllStages() {
  try {
    const stagesCollectionId = process.env.STAGES_COLLECTION_ID;
    
    if (!stagesCollectionId) {
      throw new Error('STAGES_COLLECTION_ID не настроен');
    }

    const db = emdCloud.database(stagesCollectionId);
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
    console.error('Ошибка при загрузке этапов:', error);
    throw error;
  }
}
