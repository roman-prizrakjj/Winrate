/**
 * Справочник статусов команд в матчах
 * Используется для отображения результата команды в матче
 */

export interface TeamMatchStatus {
  id: string;
  displayName: string;
  color: 'green' | 'red' | 'yellow';
  description?: string;
}

export const TEAM_MATCH_STATUSES: Record<string, TeamMatchStatus> = {
  'd2895775-3e14-4ade-a5aa-d75bef6b3a51': {
    id: 'd2895775-3e14-4ade-a5aa-d75bef6b3a51',
    displayName: 'Выиграл',
    color: 'green',
    description: 'Команда выиграла матч'
  },
  '8f8fcf2d-dfca-404d-b887-9021a1882f15': {
    id: '8f8fcf2d-dfca-404d-b887-9021a1882f15',
    displayName: 'Проиграл',
    color: 'red',
    description: 'Команда проиграла матч'
  },
  '1a5489e6-b97c-4fbe-932e-b7c03b6be705': {
    id: '1a5489e6-b97c-4fbe-932e-b7c03b6be705',
    displayName: 'Тех. поражение',
    color: 'red',
    description: 'Техническое поражение команды'
  }
} as const;

/**
 * Получить статус команды по ID
 */
export function getTeamMatchStatus(statusId: string): TeamMatchStatus {
  return TEAM_MATCH_STATUSES[statusId] || {
    id: statusId,
    displayName: 'Неизвестный статус',
    color: 'yellow',
    description: 'Статус не найден в справочнике'
  };
}

/**
 * Цвета для бейджей статусов (Tailwind CSS)
 */
export const TEAM_MATCH_STATUS_COLORS: Record<TeamMatchStatus['color'], { bg: string; text: string }> = {
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400'
  },
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400'
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400'
  }
};
