/**
 * API модуль - единая точка экспорта всех API функций
 * 
 * Используйте: import { getTournaments, getTeamStats } from '@/lib/api'
 * 
 * Все API запросы идут через EMD Cloud SDK (см. @/lib/emd-cloud)
 */

// Турниры
export { getTournaments, clearTournamentsCache } from './api/tournaments';
export type { Tournament } from './api/tournaments';

// Статистика команд
export { getTeamStats, clearTeamStatsCache } from './api/team-stats';
export type { TeamStatsResponse } from './api/team-stats';
