/**
 * Типы для работы с командами и игроками
 */

/**
 * Роль игрока в команде
 */
export type PlayerRole = 'captain' | 'player' | 'substitute' | 'unknown';

/**
 * Статус команды по составу
 */
export type TeamStatus = 'incomplete' | 'complete' | 'full' | 'overstaffed';

/**
 * Игрок команды
 */
export interface Player {
  /** ID участника команды */
  id: string;
  
  /** ID пользователя */
  userId: string;
  
  /** Игровой ник */
  nickname: string;
  
  /** Telegram username */
  telegram: string | null;
  
  /** Роль в команде */
  role: PlayerRole;
  
  /** ID роли (из справочника) */
  roleId: string;
}

/**
 * Команда
 */
export interface Team {
  /** ID команды */
  id: string;
  
  /** Название команды */
  name: string;
  
  /** Учебное заведение (короткое название) */
  school: string | null;
  
  /** Дисциплина */
  discipline: string | null;
  
  /** Дивизион */
  division: string | null;
  
  /** ID дивизиона */
  divisionId: string | null;
  
  /** Количество игроков */
  playersCount: number;
  
  /** Список игроков */
  players: Player[];
}

/**
 * Ответ API со списком команд
 */
export interface TeamsResponse {
  /** Список команд */
  teams: Team[];
  
  /** Общее количество */
  total: number;
  
  /** Время последнего обновления */
  timestamp?: string;
  
  /** Источник данных */
  source?: 'sdk' | 'cache';
}

/**
 * Параметры фильтрации команд
 */
export interface TeamsFilterParams {
  /** Поиск по названию команды или школе */
  search?: string;
  
  /** Фильтр по дисциплине */
  discipline?: string;
  
  /** Фильтр по дивизиону */
  division?: string;
  
  /** Только команды с полным составом */
  fullTeamsOnly?: boolean;
}
