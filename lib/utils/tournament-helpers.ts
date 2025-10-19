// Утилиты для маппинга данных турниров между форматами

import { TOURNAMENT_FIELD_MAPPING } from '@/lib/tournament-fields';
import type { TournamentFormData, TournamentCreatePayload } from '@/lib/types/tournament';

/**
 * Преобразует данные формы в формат для отправки в EMD Cloud API
 * Маппинг: читаемые имена → технические имена колонок (col_xxx)
 */
export function mapFormToPayload(formData: TournamentFormData): TournamentCreatePayload {
  const payload: TournamentCreatePayload = {
    [TOURNAMENT_FIELD_MAPPING.title]: formData.title,
    [TOURNAMENT_FIELD_MAPPING.status]: formData.status,
    [TOURNAMENT_FIELD_MAPPING.description]: formData.description,
    [TOURNAMENT_FIELD_MAPPING.rules]: formData.rules,
    [TOURNAMENT_FIELD_MAPPING.discipline]: formData.discipline,
    [TOURNAMENT_FIELD_MAPPING.division]: formData.division,
  };

  // Опциональные поля
  if (formData.parent_id !== undefined) {
    payload[TOURNAMENT_FIELD_MAPPING.parent_id] = formData.parent_id;
  }

  if (formData.has_fastcup !== undefined) {
    payload[TOURNAMENT_FIELD_MAPPING.has_fastcup] = formData.has_fastcup;
  }

  if (formData.showOnPlatform !== undefined) {
    payload[TOURNAMENT_FIELD_MAPPING.showOnPlatform] = formData.showOnPlatform;
  }

  return payload;
}

/**
 * Извлекает данные формы из FormData объекта
 */
export function extractFormData(formData: FormData): TournamentFormData {
  return {
    title: formData.get('title') as string,
    status: formData.get('status') as string,
    description: formData.get('description') as string || '',
    rules: formData.get('rules') as string || '',
    discipline: formData.get('discipline') as string,
    division: formData.get('division') as string,
    parent_id: formData.get('parent_id') as string | null || null,
    has_fastcup: formData.get('has_fastcup') === 'true',
    showOnPlatform: formData.get('showOnPlatform') === 'true',
  };
}

/**
 * Валидация данных формы турнира
 */
export function validateTournamentForm(data: TournamentFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Название турнира обязательно');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Название турнира не должно превышать 200 символов');
  }

  if (!data.status) {
    errors.push('Статус турнира обязателен');
  }

  if (!data.discipline) {
    errors.push('Дисциплина обязательна');
  }

  if (!data.division) {
    errors.push('Дивизион обязателен');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
