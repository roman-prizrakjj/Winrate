'use server';

// Server Action для обновления статуса этапа

import { emdCloud } from '@/lib/emd-cloud';
import { STAGE_FIELD_MAPPING } from '@/lib/stage-fields';

interface UpdateStageStatusResponse {
  success: boolean;
  error?: string;
}

/**
 * Обновление статуса этапа турнира
 * @param stageId - ID этапа
 * @param newStatusId - UUID нового статуса
 */
export async function updateStageStatus(
  stageId: string,
  newStatusId: string
): Promise<UpdateStageStatusResponse> {
  try {
    // Получаем ID коллекции этапов
    const stagesCollectionId = process.env.STAGES_COLLECTION_ID;
    if (!stagesCollectionId) {
      return {
        success: false,
        error: 'STAGES_COLLECTION_ID не настроен'
      };
    }

    // Подготавливаем данные для обновления
    const updateData = {
      [STAGE_FIELD_MAPPING.status]: newStatusId
    };

    // Обновляем запись через SDK
    const db = emdCloud.database(stagesCollectionId);
    const result = await db.updateRow(stageId, updateData, {
      notice: 'Статус этапа обновлен через веб-интерфейс'
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
    console.error('Ошибка при обновлении статуса этапа:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}
