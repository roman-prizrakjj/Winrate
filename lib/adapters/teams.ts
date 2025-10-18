/**
 * Адаптер для преобразования данных команд из SDK в формат компонентов
 */

import type { Team as SDKTeam, Player as SDKPlayer } from '@/lib/types/teams';
import type { Team as ComponentTeam, Player as ComponentPlayer } from '@/lib/mockData';

/**
 * Преобразует игрока из SDK формата в формат компонента
 */
function adaptPlayer(sdkPlayer: SDKPlayer): ComponentPlayer {
  // Маппинг ролей на русские названия
  const roleMap: Record<string, string> = {
    captain: 'Капитан',
    player: 'Игрок',
    substitute: 'Запасной',
  };

  return {
    name: sdkPlayer.nickname,
    role: roleMap[sdkPlayer.role] || undefined,
  };
}

/**
 * Преобразует команду из SDK формата в формат компонента
 */
export function adaptTeam(sdkTeam: SDKTeam): ComponentTeam {
  return {
    id: parseInt(sdkTeam.id.substring(0, 8), 16), // Преобразуем UUID в число для совместимости
    name: sdkTeam.name,
    school: sdkTeam.school || 'Не указано',
    wins: 0, // Данные статистики пока не загружаем
    losses: 0,
    winrate: 0,
    s: 0,
    players: sdkTeam.players.map(adaptPlayer),
    discipline: sdkTeam.discipline || 'Неизвестно',
  };
}

/**
 * Преобразует массив команд из SDK в формат компонентов
 */
export function adaptTeams(sdkTeams: SDKTeam[]): ComponentTeam[] {
  return sdkTeams.map(adaptTeam);
}
