'use server';

// Server Action для создания турнира

import { emdCloud } from '@/lib/emd-cloud';
import { mapFormToPayload, extractFormData, validateTournamentForm } from '@/lib/utils/tournament-helpers';
import type { TournamentCreateResponse } from '@/lib/types/tournament';

/**
 * Создание турнира
 * Server Action вызывается из компонента формы
 */
export async function createTournament(formData: FormData): Promise<TournamentCreateResponse> {
  try {
    // 1. Извлекаем данные из FormData
    const data = extractFormData(formData);

    // 2. Валидация
    const validation = validateTournamentForm(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // 3. Маппинг читаемых полей → технические (col_xxx)
    const payload = mapFormToPayload(data);

    // 4. Получаем ID коллекции турниров
    const tournamentsCollectionId = process.env.TOURNAMENTS_COLLECTION_ID;
    if (!tournamentsCollectionId) {
      return {
        success: false,
        error: 'TOURNAMENTS_COLLECTION_ID не настроен'
      };
    }

    // 5. Создаем запись через SDK
    const db = emdCloud.database(tournamentsCollectionId);
    const result = await db.createRow(payload, {
      notice: 'Турнир создан через веб-интерфейс'
    });

    // 6. Проверка на ошибку SDK
    if ('error' in result) {
      return {
        success: false,
        error: `Ошибка SDK: ${result.error}`
      };
    }

    // 7. Успешный результат
    return {
      success: true,
      data: result as any
    };

  } catch (error) {
    console.error('❌ Ошибка создания турнира:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    };
  }
}
