/**
 * Маппинг читаемых названий полей коллекции MATCHES
 * Используется при чтении данных с useHumanReadableNames: true
 * 
 * Формат: читаемое_имя → читаемое_имя (SDK сам преобразует col_xxx)
 */

export const MATCH_FIELD_MAPPING = {
  // Основные поля матча (читаемые имена, которые возвращает SDK)
  tournament: 'tournament',      // ID турнира (этапа) - вложенный объект
  tour: 'tour',                  // ID тура - вложенный объект
  teams: 'teams',                // Массив команд (MATCHES_TEAMS)
  order: 'order',                // Порядковый номер в сетке
  status: 'status',              // Статус матча (UUID) - для чтения
  processed: 'processed',        // Флаг обработки
} as const;

/**
 * Технические имена полей для записи/обновления (col_xxx)
 * Используется при updateRow, createRow
 */
export const MATCH_FIELD_TECHNICAL = {
  status: 'col_5710e8ecb2',      // Статус матча (UUID) - для записи
  tournament: 'col_61985e84a6',  // ID турнира (этапа)
  tour: 'col_345d658ce0',        // ID тура
  teams: 'col_3afa0dc265',       // Массив команд
  order: 'col_cce3f76ba1',       // Порядковый номер
  processed: 'col_642c52a2d6',   // Флаг обработки
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
