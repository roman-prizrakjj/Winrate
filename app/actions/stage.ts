'use server';

// Server Action для создания этапа турнира

import { emdCloud } from '@/lib/emd-cloud';
import { mapStageFormToPayload, extractStageFormData, validateStageForm } from '@/lib/utils/stage-helpers';
import type { StageCreateResponse } from '@/lib/types/stage';

/**
 * Создание этапа турнира
 * Server Action вызывается из компонента формы
 */
export async function createStage(formData: FormData): Promise<StageCreateResponse> {
  try {
    // 1. Извлекаем данные из FormData
    const data = extractStageFormData(formData);

    // 2. Валидация
    const validation = validateStageForm(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // 3. Маппинг читаемых полей → технические (col_xxx)
    const payload = mapStageFormToPayload(data);

    // 4. Получаем ID коллекции этапов
    const stagesCollectionId = process.env.STAGES_COLLECTION_ID;
    if (!stagesCollectionId) {
      return {
        success: false,
        error: 'STAGES_COLLECTION_ID не настроен'
      };
    }

    // 5. Создаем запись через SDK
    const db = emdCloud.database(stagesCollectionId);
    const result = await db.createRow(payload, {
      notice: 'Этап создан через веб-интерфейс'
    });

    // 6. Проверка на ошибку SDK
    if ('error' in result) {
      return {
        success: false,
        error: `Ошибка SDK: ${result.error}`
      };
    }

    // 7. Успешное создание
    return {
      success: true,
      data: result as any
    };

  } catch (error) {
    console.error('Ошибка при создании этапа:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}
