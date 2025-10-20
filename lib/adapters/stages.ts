/**
 * Адаптер для преобразования данных этапов из SDK в формат компонентов
 */

import type { Stage } from '@/lib/types/stages';
import { getStageStatusById } from '@/lib/stage-statuses';
import { getMechanicById } from '@/lib/stage-mechanics';
import { disciplines } from '@/lib/disciplines';

/**
 * Получить название дисциплины по ID
 */
function getDisciplineName(disciplineId: string): string {
  const discipline = Object.entries(disciplines).find(
    ([_, info]) => info.id === disciplineId
  );
  return discipline ? discipline[0] : 'Неизвестно';
}

/**
 * Преобразует этап из SDK формата в формат компонента
 */
export function adaptStage(sdkStage: any): Stage {
  const stageData = sdkStage.data || {};
  const tournamentData = stageData.tournament?.data || {};
  const currentTourData = stageData.current_tour?.data;

  // Получаем читаемые названия из справочников
  const status = getStageStatusById(stageData.status);
  const mechanic = getMechanicById(stageData.mechanic);
  const disciplineName = getDisciplineName(tournamentData.discipline);

  return {
    id: sdkStage._id,
    title: stageData.title || 'Без названия',
    order: stageData.order || 0,
    tournamentId: stageData.tournament?._id || '',
    tournamentTitle: tournamentData.title || 'Неизвестный турнир',
    disciplineId: tournamentData.discipline || '',
    disciplineName,
    mechanicId: stageData.mechanic || '',
    mechanicName: mechanic?.displayName || 'Неизвестно',
    statusId: stageData.status || '',
    statusName: status?.displayName || 'Неизвестно',
    currentTour: currentTourData ? {
      title: currentTourData.title || 'Без названия',
      dateStart: currentTourData.dateStart || ''
    } : null,
    teamsCount: Array.isArray(stageData.tournaments_teams_stages) 
      ? stageData.tournaments_teams_stages.length 
      : 0,
    createdAt: sdkStage.createdAt || '',
    updatedAt: sdkStage.updatedAt || ''
  };
}

/**
 * Преобразует массив этапов из SDK в формат компонентов
 */
export function adaptStages(sdkStages: any[]): Stage[] {
  return sdkStages.map(adaptStage);
}
