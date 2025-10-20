/**
 * Адаптер для преобразования данных матчей из SDK в формат UI
 */

import type { Match, AdaptedMatch } from '@/lib/types/matches';
import type { Team } from '@/lib/types/teams';
import { getMatchStatus, MATCH_STATUS_COLORS } from '@/lib/match-statuses';
import { getDisciplineNameById } from '@/lib/disciplines';

/**
 * Форматирует дату в "HH:MM"
 */
function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Адаптирует один матч для отображения
 */
export function adaptMatch(
  match: Match,
  teams: Team[]
): AdaptedMatch {
  // Сопоставление команд
  const team1Id = match.data.teams[0]?.data.team || '';
  const team2Id = match.data.teams[1]?.data.team || '';
  
  const team1 = teams.find(t => t.id === team1Id);
  const team2 = teams.find(t => t.id === team2Id);

  // Статус матча
  const matchStatus = getMatchStatus(match.data.status);
  const statusColors = MATCH_STATUS_COLORS[matchStatus.color];

  return {
    id: match._id,
    
    // Команды
    team1Id,
    team1Name: team1?.name || 'Команда не найдена',
    team2Id,
    team2Name: team2?.name || 'Команда не найдена',
    
    // Турнир/Этап/Тур
    stageName: match.data.tournament.data.title,
    stageId: match.data.tour.data.stage,
    tourName: match.data.tour.data.title,
    tourOrder: match.data.tour.data.order,
    
    // Дисциплина
    discipline: match.data.tournament.data.discipline,
    disciplineName: getDisciplineNameById(match.data.tournament.data.discipline),
    
    // Время
    dateStart: match.data.tour.data.dateStart,
    dateEnd: match.data.tour.data.dateEnd,
    timeDisplay: formatTime(match.data.tour.data.dateStart),
    
    // Статус
    status: match.data.status,
    statusDisplay: matchStatus.displayName,
    statusColor: matchStatus.color,
    
    // Порядок
    order: match.data.order,
    
    // ID записей MATCHES_TEAMS для модалки
    matchTeamsIds: [
      match.data.teams[0]?._id || '',
      match.data.teams[1]?._id || ''
    ],
  };
}

/**
 * Адаптирует массив матчей
 */
export function adaptMatches(
  matches: Match[],
  teams: Team[]
): AdaptedMatch[] {
  console.log(`[Matches Adapter] Адаптация ${matches.length} матчей`);
  console.log(`[Matches Adapter] Доступно команд: ${teams.length}`);

  const adapted = matches.map(match => adaptMatch(match, teams));
  
  console.log(`[Matches Adapter] Адаптировано матчей: ${adapted.length}`);
  
  return adapted;
}
