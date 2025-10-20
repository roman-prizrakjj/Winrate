/**
 * Справочник статусов матчей
 * Используется для отображения текущего состояния матча на карточках
 */

export interface MatchStatus {
  id: string;
  displayName: string;
  color: 'gray' | 'blue' | 'yellow' | 'red' | 'green';
  description?: string;
}

export const MATCH_STATUSES: Record<string, MatchStatus> = {
  '89efb7f8-85dc-4fb8-80f5-cb36439880b3': {
    id: '89efb7f8-85dc-4fb8-80f5-cb36439880b3',
    displayName: 'Ожидание игры',
    color: 'gray',
    description: 'Матч запланирован, игра еще не началась'
  },
  '50ac2a17-b764-4af8-977e-86b17a9429df': {
    id: '50ac2a17-b764-4af8-977e-86b17a9429df',
    displayName: 'Идёт игра',
    color: 'blue',
    description: 'Матч в процессе, команды играют'
  },
  '001bd46b-c57f-4841-8894-6735b3d8d54a': {
    id: '001bd46b-c57f-4841-8894-6735b3d8d54a',
    displayName: 'Ожидание подтверждения',
    color: 'yellow',
    description: 'Игра завершена, ожидается подтверждение результатов'
  },
  '5aa54aff-9556-4ca8-a2d6-050f977e86d9': {
    id: '5aa54aff-9556-4ca8-a2d6-050f977e86d9',
    displayName: 'Протест',
    color: 'red',
    description: 'Подан протест на результаты матча'
  },
  'ae42077e-0118-4e08-8928-17501c31b576': {
    id: 'ae42077e-0118-4e08-8928-17501c31b576',
    displayName: 'Игра завершена',
    color: 'green',
    description: 'Матч завершен, результаты подтверждены'
  }
} as const;

/**
 * Получить статус матча по ID
 */
export function getMatchStatus(statusId: string): MatchStatus {
  return MATCH_STATUSES[statusId] || {
    id: statusId,
    displayName: 'Неизвестный статус',
    color: 'gray'
  };
}

/**
 * Получить все статусы матчей (для фильтров)
 */
export function getAllMatchStatuses(): MatchStatus[] {
  return Object.values(MATCH_STATUSES);
}

/**
 * Цветовая схема для статусов
 */
export const MATCH_STATUS_COLORS = {
  gray: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400'
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400'
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400'
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400'
  }
} as const;
