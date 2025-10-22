// Статусы этапов турнира
// UUID из EMD Cloud коллекции статусов этапов

export interface StageStatus {
  id: string;
  name: string;
  displayName: string;
}

export const STAGE_STATUSES: StageStatus[] = [
  {
    id: 'd1bf2988-fba3-4cd5-b3e7-0a5bcdf22a23',
    name: 'waiting',
    displayName: 'Ожидает запуска'
  },
  {
    id: '71c6f9a0-35e4-4236-abe9-efe9cb79f158',
    name: 'start',
    displayName: 'Запустить этап'
  },
  {
    id: '45b4f552-7195-4f73-96db-dbad80f8c148',
    name: 'active',
    displayName: 'Активен'
  },
  {
    id: '7a81a208-f402-42a9-a0ab-92f75f3684ff',
    name: 'completed',
    displayName: 'Завершен'
  }
];

/**
 * Цвета для статусов этапов
 */
export const STAGE_STATUS_COLORS: Record<string, string> = {
  'd1bf2988-fba3-4cd5-b3e7-0a5bcdf22a23': '#F59E0B', // Оранжевый - Ожидает запуска
  '71c6f9a0-35e4-4236-abe9-efe9cb79f158': '#3B82F6', // Синий - Запустить этап
  '45b4f552-7195-4f73-96db-dbad80f8c148': '#10B981', // Зелёный - Активен
  '7a81a208-f402-42a9-a0ab-92f75f3684ff': '#EF4444', // Красный - Завершен
} as const;

// Статус по умолчанию для новых этапов
export const DEFAULT_STAGE_STATUS_ID = 'd1bf2988-fba3-4cd5-b3e7-0a5bcdf22a23'; // Ожидает запуска

/**
 * Получить статус по ID
 */
export function getStageStatusById(id: string): StageStatus | undefined {
  return STAGE_STATUSES.find(status => status.id === id);
}

/**
 * Получить статус по имени
 */
export function getStageStatusByName(name: string): StageStatus | undefined {
  return STAGE_STATUSES.find(status => status.name === name);
}

/**
 * Получить цвет статуса по UUID
 */
export function getStageStatusColor(statusId: string): string {
  return STAGE_STATUS_COLORS[statusId] || '#6B7280';
}
