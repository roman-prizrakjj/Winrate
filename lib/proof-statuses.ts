/**
 * Справочник статусов проверки доказательств
 * Используется для отображения согласия команды с результатом матча
 */

export interface ProofStatus {
  id: string;
  displayName: string;
  color: 'green' | 'red' | 'yellow';
  description?: string;
}

export const PROOF_STATUSES: Record<string, ProofStatus> = {
  '1c80658a-eaf5-4212-99e9-ea359957037e': {
    id: '1c80658a-eaf5-4212-99e9-ea359957037e',
    displayName: 'Согласен с результатом',
    color: 'green',
    description: 'Команда согласна с результатом матча'
  },
  'e583b376-7323-4e60-8c97-ac723e59a1fa': {
    id: 'e583b376-7323-4e60-8c97-ac723e59a1fa',
    displayName: 'Не согласен с результатом',
    color: 'red',
    description: 'Команда оспаривает результат матча'
  }
} as const;

/**
 * Получить статус проверки по ID
 */
export function getProofStatus(statusId: string | null): ProofStatus {
  if (!statusId) {
    return {
      id: 'pending',
      displayName: 'Ожидает проверки',
      color: 'yellow',
      description: 'Результат еще не подтвержден'
    };
  }

  return PROOF_STATUSES[statusId] || {
    id: statusId,
    displayName: 'Неизвестный статус',
    color: 'yellow',
    description: 'Статус не найден в справочнике'
  };
}

/**
 * Цвета для бейджей статусов проверки (Tailwind CSS)
 */
export const PROOF_STATUS_COLORS: Record<ProofStatus['color'], { bg: string; text: string }> = {
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
