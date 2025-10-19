// Утилиты для работы с этапами турнира

import { STAGE_FIELD_MAPPING, REQUIRED_STAGE_FIELDS } from '@/lib/stage-fields';
import type { StageFormData, StageCreatePayload } from '@/lib/types/stage';

/**
 * Извлечение данных из FormData
 */
export function extractStageFormData(formData: FormData): StageFormData {
  return {
    tournament: formData.get('tournament') as string,
    title: formData.get('title') as string,
    mechanic: formData.get('mechanic') as string,
    status: formData.get('status') as string,
    order: parseInt(formData.get('order') as string, 10) || 1,
  };
}

/**
 * Валидация формы этапа
 */
export function validateStageForm(data: StageFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Проверка обязательных полей
  if (!data.tournament || data.tournament.trim() === '') {
    errors.push('Не выбран турнир');
  }

  if (!data.title || data.title.trim() === '') {
    errors.push('Название этапа обязательно');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Название этапа не должно превышать 200 символов');
  }

  if (!data.mechanic || data.mechanic.trim() === '') {
    errors.push('Не выбрана механика');
  }

  if (!data.status || data.status.trim() === '') {
    errors.push('Не выбран статус');
  }

  if (!data.order || data.order < 1) {
    errors.push('Порядковый номер должен быть больше 0');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Маппинг данных формы в payload для SDK (читаемые имена → col_xxx)
 */
export function mapStageFormToPayload(data: StageFormData): StageCreatePayload {
  const payload: any = {
    [STAGE_FIELD_MAPPING.tournament]: data.tournament,
    [STAGE_FIELD_MAPPING.title]: data.title,
    [STAGE_FIELD_MAPPING.mechanic]: data.mechanic,
    [STAGE_FIELD_MAPPING.status]: data.status,
    [STAGE_FIELD_MAPPING.order]: data.order,
    [STAGE_FIELD_MAPPING.tours]: [],                    // Пустой массив при создании
    [STAGE_FIELD_MAPPING.tournaments_teams_stages]: []  // Пустой массив при создании
  };
  
  return payload as StageCreatePayload;
}
