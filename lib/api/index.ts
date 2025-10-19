// Единая точка экспорта всех API функций
// Использование: import { getTournaments, Tournament } from '@/lib/api'

// Турниры
export { getTournaments, clearTournamentsCache } from './tournaments';
export type { Tournament } from './tournaments';

// Здесь будут экспорты других модулей:
// export { getMatches, createMatch, updateMatch } from './matches';
// export { getTeams, getTeamById } from './teams';
// export { getPlayers, addPlayer } from './players';

