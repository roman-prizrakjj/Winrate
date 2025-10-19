'use server';

// Server Action для создания тура

import { emdCloud } from '@/lib/emd-cloud';
import { mapTourFormToPayload, extractTourFormData, validateTourForm } from '@/lib/utils/tour-helpers';
import type { TourCreateResponse } from '@/lib/types/tour';

/**
 * Создание тура
 * Server Action вызывается из компонента формы
 */
export async function createTour(formData: FormData): Promise<TourCreateResponse> {
  try {
    // 1. Извлекаем данные из FormData
    const data = extractTourFormData(formData);

    // 2. Валидация
    const validation = validateTourForm(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // 3. Маппинг читаемых полей → технические (col_xxx)
    const payload = mapTourFormToPayload(data);

    // 4. Получаем ID коллекции туров
    const toursCollectionId = process.env.TOURS_COLLECTION_ID;
    if (!toursCollectionId) {
      return {
        success: false,
        error: 'TOURS_COLLECTION_ID не настроен'
      };
    }

    // 5. Создаем запись через SDK
    const db = emdCloud.database(toursCollectionId);
    const result = await db.createRow(payload, {
      notice: 'Тур создан через веб-интерфейс'
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
    console.error('Ошибка при создании тура:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}
