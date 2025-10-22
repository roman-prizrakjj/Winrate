/**
 * Адаптер для преобразования данных турниров из SDK в формат компонентов
 */

import type { Tournament, TournamentStage, TournamentTour } from '@/lib/types/tournaments';
import { getTournamentStatusName, getTournamentStatusColor } from '@/lib/tournamentStatuses';
import { getMechanicById } from '@/lib/stage-mechanics';

/**
 * Преобразует тур из SDK формата
 */
function adaptTour(sdkTour: any): TournamentTour {
  const tourData = sdkTour.data || {};
  
  return {
    id: sdkTour._id,
    title: tourData.title || 'Без названия',
    matchesCount: Array.isArray(tourData.matches) ? tourData.matches.length : 0,
    dateStart: tourData.dateStart || undefined,
    dateEnd: tourData.dateEnd || undefined,
    order: tourData.order || 0,
  };
}

/**
 * Преобразует этап из SDK формата
 */
function adaptStage(sdkStage: any): TournamentStage {
  const stageData = sdkStage.data || {};
  const mechanic = getMechanicById(stageData.mechanic);
  
  return {
    id: sdkStage._id,
    title: stageData.title || 'Без названия',
    mechanic: mechanic?.displayName || 'Неизвестно',
    status: getTournamentStatusName(stageData.status),
    toursCount: Array.isArray(stageData.tours) ? stageData.tours.length : 0,
    order: stageData.order || 0,
  };
}

/**
 * Преобразует турнир из SDK формата в формат компонента
 */
export function adaptTournament(sdkTournament: any): Tournament {
  const tournamentData = sdkTournament.data || {};
  const disciplineData = tournamentData.discipline?.data || {};
  const divisionData = tournamentData.division?.data || {};

  const statusId = tournamentData.status || '';
  const statusName = getTournamentStatusName(statusId);
  const statusColor = getTournamentStatusColor(statusId);

  // Преобразуем туры и этапы
  const tours = Array.isArray(tournamentData.tours) 
    ? tournamentData.tours.map(adaptTour) 
    : [];
  
  const stages = Array.isArray(tournamentData.stages) 
    ? tournamentData.stages.map(adaptStage) 
    : [];

  // Получаем список команд
  const teams = Array.isArray(tournamentData.tournaments_teams)
    ? tournamentData.tournaments_teams.map((team: any) => team._id || team)
    : [];

  return {
    id: sdkTournament._id,
    title: tournamentData.title || 'Без названия',
    description: tournamentData.description || undefined,
    rules: tournamentData.rules || undefined,
    discipline: {
      name: disciplineData.name || 'Неизвестная дисциплина',
      minPlayers: disciplineData.minPlayers || undefined,
    },
    division: {
      name: divisionData.name || 'Неизвестный дивизион',
    },
    status: statusId,
    statusName,
    statusColor,
    toursCount: tours.length,
    stagesCount: stages.length,
    teamsCount: teams.length,
    tours,
    stages,
    teams,
    showOnPlatform: tournamentData.showOnPlatform || false,
    hasFastcup: tournamentData.has_fastcup || false,
    createdAt: sdkTournament.createdAt || '',
    updatedAt: sdkTournament.updatedAt || '',
  };
}

/**
 * Преобразует массив турниров из SDK в формат компонентов
 */
export function adaptTournaments(sdkTournaments: any[]): Tournament[] {
  return sdkTournaments.map(adaptTournament);
}
