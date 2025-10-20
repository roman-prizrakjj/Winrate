/**
 * Типы для работы с матчами
 */

/**
 * Команда в матче (из MATCHES_TEAMS)
 */
export interface MatchTeam {
  _id: string;
  data: {
    tournament: string;           // ID турнира
    tour: string;                 // ID тура
    match: string;                // ID матча
    team: string;                 // ID команды
    status: string;               // Статус результата (WIN/LOSS)
    proof: string | null;         // Ссылка на доказательства
    proof_status: string | null;  // Статус проверки доказательств
  };
  notice?: string;
}

/**
 * Турнир (этап) вложенный в матч
 */
export interface MatchTournament {
  _id: string;
  data: {
    title: string;                // Название этапа
    status: string;               // Статус турнира
    discipline: string;           // ID дисциплины
    division: string;             // ID дивизиона
    description?: string;
    rules?: string;
    // ... другие поля
  };
}

/**
 * Тур вложенный в матч
 */
export interface MatchTour {
  _id: string;
  data: {
    tournament: string;           // ID родительского турнира
    stage: string;                // ID этапа
    title: string;                // Название тура
    order: number;                // Порядковый номер тура
    dateStart: string;            // Дата начала (ISO)
    dateEnd: string;              // Дата окончания (ISO)
    matches: string[];            // Массив ID матчей
    results: string[];            // Массив ID результатов
  };
}

/**
 * Матч (сырые данные из SDK)
 */
export interface Match {
  _id: string;
  createdAt: string;
  updatedAt: string;
  data: {
    tournament: MatchTournament;  // Вложенный турнир (этап)
    tour: MatchTour;              // Вложенный тур
    teams: MatchTeam[];           // Массив команд (всегда 2)
    order: number;                // Порядок в сетке
    status: string;               // UUID статуса матча
    processed: boolean;           // Обработан ли
  };
  user?: any;
}

/**
 * Адаптированный матч для UI
 */
export interface AdaptedMatch {
  id: string;                     // _id матча
  
  // Команды
  team1Id: string;                // ID первой команды
  team1Name: string;              // Название первой команды
  team2Id: string;                // ID второй команды
  team2Name: string;              // Название второй команды
  
  // Турнир/Этап/Тур
  stageName: string;              // Название этапа
  stageId: string;                // ID этапа
  tourName: string;               // Название тура ("8й тур")
  tourOrder: number;              // Номер тура
  
  // Дисциплина
  discipline: string;             // ID дисциплины (для иконки)
  disciplineName?: string;        // Название дисциплины
  
  // Время
  dateStart: string;              // ISO дата начала
  dateEnd: string;                // ISO дата окончания
  timeDisplay: string;            // Отформатированное время "15:00"
  
  // Статус
  status: string;                 // UUID статуса матча
  statusDisplay: string;          // Текст статуса ("Ожидание игры")
  statusColor: string;            // Цвет статуса
  
  // Порядок
  order: number;                  // Порядок в сетке
  
  // Для модального окна (загружается отдельно)
  matchTeamsIds: [string, string]; // ID записей MATCHES_TEAMS
}

/**
 * Ответ от сервиса загрузки матчей
 */
export interface MatchesResponse {
  matches: Match[];
  total: number;
}
