// Маппинг полей этапов турнира
// Читаемые имена ↔ Технические имена (col_xxx) из EMD Cloud

/**
 * Маппинг: читаемое имя → техническое имя (col_xxx)
 */
export const STAGE_FIELD_MAPPING: Record<string, string> = {
  tournament: 'col_e2c5584fde',           // Reference на турнир (обязательно)
  title: 'col_7ef90ab5ee',                // Название этапа (обязательно)
  mechanic: 'col_9d5ca1d664',             // UUID механики (обязательно)
  status: 'col_04f88e07b9',               // UUID статуса (обязательно)
  order: 'col_c4660c0e50',                // Порядковый номер (обязательно)
  current_tour: 'col_00b85a3840',         // Reference на текущий тур (необязательно)
  tours: 'col_a9048c1624',                // Array туров (необязательно)
  tournaments_teams_stages: 'col_da148c8009' // Array команд в этапе (необязательно)
};

/**
 * Обратный маппинг: техническое имя (col_xxx) → читаемое имя
 */
export const STAGE_FIELD_REVERSE_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(STAGE_FIELD_MAPPING).map(([key, value]) => [value, key])
);

/**
 * Обязательные поля для создания этапа
 */
export const REQUIRED_STAGE_FIELDS = [
  'tournament',
  'title',
  'mechanic',
  'status',
  'order'
] as const;
