/**
 * Маппинг технических названий полей коллекции MATCHES
 * на читаемые имена для использования в коде
 * 
 * Формат: читаемое_имя → col_xxx (техническое имя в БД)
 */

export const MATCH_FIELD_MAPPING = {
  // Основные поля матча
  tournament: 'tournament',      // ID турнира (этапа) - вложенный объект
  tour: 'tour',                  // ID тура - вложенный объект
  teams: 'teams',                // Массив команд (MATCHES_TEAMS)
  order: 'order',                // Порядковый номер в сетке
  status: 'status',              // Статус матча (UUID)
  processed: 'processed',        // Флаг обработки
  
  // Поля могут быть col_xxx, уточнить при необходимости
} as const;

/**
 * Обратный маппинг: col_xxx → читаемое имя
 */
export const MATCH_FIELD_MAPPING_REVERSE = Object.fromEntries(
  Object.entries(MATCH_FIELD_MAPPING).map(([key, value]) => [value, key])
) as Record<string, keyof typeof MATCH_FIELD_MAPPING>;

/**
 * Получить техническое имя поля по читаемому
 */
export function getMatchFieldName(readableName: keyof typeof MATCH_FIELD_MAPPING): string {
  return MATCH_FIELD_MAPPING[readableName];
}

/**
 * Получить читаемое имя поля по техническому
 */
export function getMatchFieldReadableName(technicalName: string): string {
  return MATCH_FIELD_MAPPING_REVERSE[technicalName] || technicalName;
}
