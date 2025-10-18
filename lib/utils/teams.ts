/**
 * Утилиты для работы с командами
 */

import type { Team, TeamStatus } from '@/lib/types/teams';

/**
 * Определяет статус команды по количеству игроков
 * 
 * @param playersCount - Количество игроков в команде
 * @returns Статус команды
 */
export function getTeamStatus(playersCount: number): TeamStatus {
  if (playersCount < 5) return 'incomplete';
  if (playersCount === 5) return 'complete';
  if (playersCount === 6) return 'full';
  return 'overstaffed';
}

/**
 * Возвращает текстовое описание статуса
 */
export function getTeamStatusLabel(status: TeamStatus): string {
  const labels: Record<TeamStatus, string> = {
    incomplete: 'Неполный состав',
    complete: 'Полный состав',
    full: 'Полный состав + запасной',
    overstaffed: 'Переполнен',
  };
  return labels[status];
}

/**
 * Возвращает цвет для статуса (Tailwind classes)
 */
export function getTeamStatusColor(status: TeamStatus): string {
  const colors: Record<TeamStatus, string> = {
    incomplete: 'text-red-500',
    complete: 'text-green-500',
    full: 'text-blue-500',
    overstaffed: 'text-orange-500',
  };
  return colors[status];
}

/**
 * Фильтрация команд по поисковому запросу
 */
export function filterTeamsBySearch(teams: Team[], search: string): Team[] {
  if (!search.trim()) return teams;
  
  const query = search.toLowerCase().trim();
  
  return teams.filter((team) => {
    return (
      team.name.toLowerCase().includes(query) ||
      team.school?.toLowerCase().includes(query) ||
      team.players.some(
        (player) =>
          player.nickname.toLowerCase().includes(query) ||
          player.telegram?.toLowerCase().includes(query)
      )
    );
  });
}

/**
 * Фильтрация команд по дисциплине
 */
export function filterTeamsByDiscipline(teams: Team[], discipline: string): Team[] {
  if (!discipline) return teams;
  return teams.filter((team) => team.discipline === discipline);
}

/**
 * Фильтрация команд по дивизиону
 */
export function filterTeamsByDivision(teams: Team[], division: string): Team[] {
  if (!division) return teams;
  return teams.filter((team) => team.division === division);
}

/**
 * Получение уникальных дисциплин из списка команд
 */
export function getUniqueDisciplines(teams: Team[]): string[] {
  const disciplines = new Set<string>();
  teams.forEach((team) => {
    if (team.discipline) disciplines.add(team.discipline);
  });
  return Array.from(disciplines).sort();
}

/**
 * Получение уникальных дивизионов из списка команд
 */
export function getUniqueDivisions(teams: Team[]): string[] {
  const divisions = new Set<string>();
  teams.forEach((team) => {
    if (team.division) divisions.add(team.division);
  });
  return Array.from(divisions).sort();
}
