// Маппинг полей туров
// Читаемые имена ↔ Технические имена (col_xxx) из EMD Cloud

/**
 * Маппинг: читаемое имя → техническое имя (col_xxx)
 */
export const TOUR_FIELD_MAPPING: Record<string, string> = {
  tournament: 'col_3727fe7a0f',          // Reference на турнир (обязательно)
  stage: 'col_2fbf9b9970',               // Reference на этап (обязательно)
  current_stage: 'col_740b44439e',       // Reference на текущий этап (дублирует stage)
  title: 'col_a0023ff3ed',               // Название тура (обязательно)
  order: 'col_afdc21ee3d',               // Порядковый номер (обязательно)
  dateStart: 'col_079e4605a4',           // Дата и время начала (обязательно)
  dateEnd: 'col_5685527a30',             // Дата и время окончания (обязательно)
  matches: 'col_83cc0eea00',             // Array матчей (необязательно)
  results: 'col_802246619d'              // Array результатов (необязательно)
};

/**
 * Обратный маппинг: техническое имя (col_xxx) → читаемое имя
 */
export const TOUR_FIELD_REVERSE_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(TOUR_FIELD_MAPPING).map(([key, value]) => [value, key])
);

/**
 * Обязательные поля для создания тура
 */
export const REQUIRED_TOUR_FIELDS = [
  'tournament',
  'stage',
  'title',
  'order',
  'dateStart',
  'dateEnd'
] as const;
