// Статусы турниров
// UUID из EMD Cloud коллекции статусов

export interface TournamentStatus {
  id: string;
  name: string;
  displayName: string;
}

export const TOURNAMENT_STATUSES: TournamentStatus[] = [
  {
    id: '43a217ee-ab5e-4fdd-bb45-7549ac9a645c',
    name: 'created',
    displayName: 'Турнир создан'
  },
  {
    id: '2f3846ea-120b-4962-8875-1a676ba915ba',
    name: 'registration',
    displayName: 'Идёт регистрация'
  },
  {
    id: 'af33f649-8239-481b-99d7-3381576a1e5e',
    name: 'registration_closed',
    displayName: 'Регистрация завершена'
  },
  {
    id: '5b287307-f746-4794-af0b-bef44bed974a',
    name: 'draw',
    displayName: 'Проведение жеребьёвки'
  },
  {
    id: '38709e69-343f-4544-9bc3-e4d483372ca5',
    name: 'in_progress',
    displayName: 'Проведение турнира'
  },
  {
    id: 'd4ef2969-7ebd-41b7-89c5-2d5b41ca46c1',
    name: 'finished',
    displayName: 'Турнир завершён'
  }
];

// Утилиты для работы со статусами
export function getStatusById(id: string): TournamentStatus | undefined {
  return TOURNAMENT_STATUSES.find(status => status.id === id);
}

export function getStatusByName(name: string): TournamentStatus | undefined {
  return TOURNAMENT_STATUSES.find(status => status.name === name);
}

// Статус по умолчанию (Турнир создан)
export const DEFAULT_STATUS_ID = '43a217ee-ab5e-4ffd-bb45-7549ac9a645c';
