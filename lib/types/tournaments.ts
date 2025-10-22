/**
 * Типы для турниров
 */

export interface TournamentTour {
  id: string;
  title: string;
  matchesCount: number;
  dateStart?: string;
  dateEnd?: string;
  order: number;
}

export interface TournamentStage {
  id: string;
  title: string;
  mechanic: string;
  status: string;
  toursCount: number;
  order: number;
}

export interface Tournament {
  id: string;
  title: string;
  description?: string;
  rules?: string;
  discipline: {
    name: string;
    minPlayers?: number;
  };
  division: {
    name: string;
  };
  status: string;
  statusName: string;
  statusColor: string;
  toursCount: number;
  stagesCount: number;
  teamsCount: number;
  tours: TournamentTour[];
  stages: TournamentStage[];
  teams: string[]; // массив UUID команд
  showOnPlatform: boolean;
  hasFastcup: boolean;
  createdAt: string;
  updatedAt: string;
}
