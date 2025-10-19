// Утилиты для работы с турами

import { TOUR_FIELD_MAPPING, REQUIRED_TOUR_FIELDS } from '@/lib/tour-fields';
import type { TourFormData, TourCreatePayload } from '@/lib/types/tour';

/**
 * Извлечение данных тура из FormData
 */
export function extractTourFormData(formData: FormData): TourFormData {
  return {
    tournament: formData.get('tournament') as string,
    stage: formData.get('stage') as string,
    title: formData.get('title') as string,
    order: parseInt(formData.get('order') as string, 10),
    dateStart: formData.get('dateStart') as string,
    dateEnd: formData.get('dateEnd') as string
  };
}

/**
 * Валидация данных формы тура
 */
export function validateTourForm(data: TourFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Проверка обязательных полей
  if (!data.tournament) errors.push('Выберите турнир');
  if (!data.stage) errors.push('Выберите этап');
  if (!data.title?.trim()) errors.push('Введите название тура');
  if (!data.order || data.order < 1) errors.push('Укажите корректный порядковый номер');
  if (!data.dateStart) errors.push('Укажите дату начала');
  if (!data.dateEnd) errors.push('Укажите дату окончания');

  // Проверка дат
  if (data.dateStart && data.dateEnd) {
    const start = new Date(data.dateStart);
    const end = new Date(data.dateEnd);
    
    if (isNaN(start.getTime())) {
      errors.push('Некорректная дата начала');
    }
    if (isNaN(end.getTime())) {
      errors.push('Некорректная дата окончания');
    }
    
    if (start.getTime() >= end.getTime()) {
      errors.push('Дата окончания должна быть позже даты начала');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Маппинг данных формы в payload для SDK (col_xxx)
 */
export function mapTourFormToPayload(data: TourFormData): TourCreatePayload {
  // Преобразуем datetime-local в ISO string
  const dateStart = new Date(data.dateStart).toISOString();
  const dateEnd = new Date(data.dateEnd).toISOString();

  return {
    [TOUR_FIELD_MAPPING.tournament]: data.tournament,
    [TOUR_FIELD_MAPPING.stage]: data.stage,
    [TOUR_FIELD_MAPPING.current_stage]: data.stage, // Дублируем stage в current_stage
    [TOUR_FIELD_MAPPING.title]: data.title.trim(),
    [TOUR_FIELD_MAPPING.order]: data.order,
    [TOUR_FIELD_MAPPING.dateStart]: dateStart,
    [TOUR_FIELD_MAPPING.dateEnd]: dateEnd,
    [TOUR_FIELD_MAPPING.matches]: [],      // Пустой массив
    [TOUR_FIELD_MAPPING.results]: []       // Пустой массив
  } as unknown as TourCreatePayload;
}
