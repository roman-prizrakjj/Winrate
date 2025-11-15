'use server';

// Server Action для обновления статуса матча

import { emdCloud } from '@/lib/emd-cloud';
import { MATCH_FIELD_TECHNICAL } from '@/lib/match-fields';

interface UpdateMatchStatusResponse {
  success: boolean;
  error?: string;
}

/**
 * Обновление статуса матча
 * @param matchId - ID матча
 * @param newStatusId - UUID нового статуса
 */
export async function updateMatchStatus(
  matchId: string,
  newStatusId: string
): Promise<UpdateMatchStatusResponse> {
  try {
    // Получаем ID коллекции матчей
    const matchesCollectionId = process.env.MATCHES_COLLECTION_ID;
    if (!matchesCollectionId) {
      return {
        success: false,
        error: 'MATCHES_COLLECTION_ID не настроен'
      };
    }

    // Подготавливаем данные для обновления (используем техническое имя col_xxx)
    const updateData = {
      [MATCH_FIELD_TECHNICAL.status]: newStatusId
    };

    // Обновляем запись через SDK
    const db = emdCloud.database(matchesCollectionId);
    const result = await db.updateRow(matchId, updateData, {
      notice: 'Статус матча обновлен через веб-интерфейс'
    });

    // Проверка на ошибку SDK
    if ('error' in result) {
      return {
        success: false,
        error: `Ошибка SDK: ${result.error}`
      };
    }

    // Успешное обновление
    return {
      success: true
    };

  } catch (error) {
    console.error('Ошибка при обновлении статуса матча:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}
