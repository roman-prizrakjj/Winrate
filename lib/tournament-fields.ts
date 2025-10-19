// Маппинг технических имен колонок турнира (col_xxx) на читаемые имена
// Используется для преобразования данных формы в формат EMD Cloud API

export const TOURNAMENT_FIELD_MAPPING = {
  // Читаемое имя → Техническое имя колонки
  title: 'col_edf500ac9f',              // Название турнира (REQUIRED)
  status: 'col_e573271bf6',             // UUID статуса турнира (REQUIRED)
  description: 'col_646c0d8168',        // HTML описание турнира
  rules: 'col_0db1a5550a',              // HTML правила турнира
  discipline: 'col_92ec3ffcd5',         // ID дисциплины
  division: 'col_c700785317',           // ID дивизиона
  parent_id: 'col_920699b1c2',          // parent_id (null если не подтурнир)
  has_fastcup: 'col_016711397c',        // Быстрый турнир (boolean)
  showOnPlatform: 'col_7889da834e',     // Показывать на платформе (boolean)
  
  // Массивы (опциональные, можно не передавать)
  tours: 'col_1bfc9d4ccd',              // Массив туров
  matches: 'col_7d060fca22',            // Массив матчей
  results: 'col_cb42476aa4',            // Результаты турнира
  stages: 'col_c3e8147b66',             // Этапы турнира
  tournaments_teams_stages: 'col_0cb85dd0b2', // Связь команд и этапов
  tournaments_teams: 'col_18ebad136a',  // Команды турнира
} as const;

// Обратный маппинг (техническое → читаемое)
export const TOURNAMENT_FIELD_REVERSE_MAPPING = Object.fromEntries(
  Object.entries(TOURNAMENT_FIELD_MAPPING).map(([key, value]) => [value, key])
) as Record<string, keyof typeof TOURNAMENT_FIELD_MAPPING>;

// Типы для автокомплита
export type TournamentFieldName = keyof typeof TOURNAMENT_FIELD_MAPPING;
export type TournamentTechnicalFieldName = typeof TOURNAMENT_FIELD_MAPPING[TournamentFieldName];
