/**
 * Статусы турниров
 * Маппинг UUID статусов на их текстовые представления
 */

export const TOURNAMENT_STATUS: Record<string, string> = {
  '43a217ee-ab5e-4fdd-bb45-7549ac9a645c': 'Турнир создан',
  '2f3846ea-120b-4962-8875-1a676ba915ba': 'Идёт регистрация',
  'af33f649-8239-481b-99d7-3381576a1e5e': 'Регистрация завершена',
  '5b287307-f746-4794-af0b-bef44bed974a': 'Проведение жеребьёвки',
  '38709e69-343f-4544-9bc3-e4d483372ca5': 'Проведение турнира',
  'd4ef2969-7ebd-41b7-89c5-2d5b41ca46c1': 'Турнир завершён',
} as const;

/**
 * Цвета для статусов турниров
 * Для визуального отображения в UI
 */
export const TOURNAMENT_STATUS_COLORS: Record<string, string> = {
  '43a217ee-ab5e-4fdd-bb45-7549ac9a645c': '#6B7280', // Серый - создан
  '2f3846ea-120b-4962-8875-1a676ba915ba': '#3B82F6', // Синий - регистрация
  'af33f649-8239-481b-99d7-3381576a1e5e': '#8B5CF6', // Фиолетовый - регистрация завершена
  '5b287307-f746-4794-af0b-bef44bed974a': '#F59E0B', // Оранжевый - жеребьёвка
  '38709e69-343f-4544-9bc3-e4d483372ca5': '#10B981', // Зелёный - проведение
  'd4ef2969-7ebd-41b7-89c5-2d5b41ca46c1': '#EF4444', // Красный - завершён
} as const;

/**
 * Получить название статуса по UUID
 */
export function getTournamentStatusName(statusId: string): string {
  return TOURNAMENT_STATUS[statusId] || 'Неизвестный статус';
}

/**
 * Получить цвет статуса по UUID
 */
export function getTournamentStatusColor(statusId: string): string {
  return TOURNAMENT_STATUS_COLORS[statusId] || '#6B7280';
}
