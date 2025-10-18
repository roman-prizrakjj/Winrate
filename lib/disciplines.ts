// lib/disciplines.ts
// Информация о дисциплинах и требованиях по количеству игроков
export interface DisciplineInfo {
  min: number;
  max: number;
  icon: string;
  displayName?: string;
}
// Информация о дисциплинах с требованиями по количеству игроков (без капитана)
export const disciplines: Record<string, DisciplineInfo> = {
  "Counter-Strike 2": { min: 5, max: 7, icon: "/icons/disciplines/cs2.svg" },
  "Dota 2": { min: 5, max: 7, icon: "/icons/disciplines/dota2.svg" },
  "Fortnite": { min: 3, max: 4, icon: "/icons/disciplines/fortnite.svg" },
  "MLBB": { min: 5, max: 7, icon: "/icons/disciplines/mlbb.svg" },
  "Standoff 2": { min: 5, max: 7, icon: "/icons/disciplines/standoff.svg" },
  "Strinova": { min: 5, max: 7, icon: "/icons/disciplines/strinova.svg" },
  "Valorant": { min: 5, max: 7, icon: "/icons/disciplines/valorant.svg" },
  "Warface": { min: 5, max: 7, icon: "/icons/disciplines/warface.svg" },
  "Калибр": { min: 4, max: 5, icon: "/icons/disciplines/калибр.svg" },
  "Мир танков (Стальной охотник)": { min: 1, max: 1, icon: "/icons/disciplines/мир танков.svg" },
  "Мир танков 3x3": { min: 3, max: 4, icon: "/icons/disciplines/мир танков.svg" }
};

// Утилитарные функции для определения статуса команды
// Важно: в disciplines указано количество игроков БЕЗ капитана
// Капитан всегда есть дополнительно, поэтому от общего количества отнимаем 1
export function isTeamComplete(totalPlayers: number, discipline: string): boolean {
  const disciplineInfo = disciplines[discipline];
  if (!disciplineInfo) return false;
  // Вычитаем капитана из общего количества и сравниваем с минимумом
  const playersWithoutCaptain = Math.max(0, totalPlayers - 1);
  return playersWithoutCaptain >= disciplineInfo.min;
}
// Проверяет, полная ли команда (равна максимуму)
export function isTeamFull(totalPlayers: number, discipline: string): boolean {
  const disciplineInfo = disciplines[discipline];
  if (!disciplineInfo) return false;
  // Вычитаем капитана из общего количества и сравниваем с максимумом
  const playersWithoutCaptain = Math.max(0, totalPlayers - 1);
  return playersWithoutCaptain === disciplineInfo.max;
}
// Получает статус команды: 'incomplete' | 'complete' | 'full' | 'overstaffed'
export function getTeamStatus(totalPlayers: number, discipline: string): 'incomplete' | 'complete' | 'full' | 'overstaffed' {
  const disciplineInfo = disciplines[discipline];
  if (!disciplineInfo) return 'incomplete';
  
  // Вычитаем капитана из общего количества
  const playersWithoutCaptain = Math.max(0, totalPlayers - 1);
  
  if (playersWithoutCaptain < disciplineInfo.min) return 'incomplete';
  if (playersWithoutCaptain === disciplineInfo.max) return 'full';
  if (playersWithoutCaptain > disciplineInfo.max) return 'overstaffed';
  return 'complete';
}
// Утилита для получения текстового требования по дисциплине
export function getDisciplineRequirement(discipline: string): string {
  const disciplineInfo = disciplines[discipline];
  if (!disciplineInfo) return '?/?';
  
  // Показываем общее количество (включая капитана)
  const minTotal = disciplineInfo.min + 1; // +1 капитан
  const maxTotal = disciplineInfo.max + 1; // +1 капитан
  
  if (minTotal === maxTotal) {
    return `${minTotal}`;
  }
  return `${minTotal}-${maxTotal}`;
}

// Утилита для получения иконки дисциплины
export function getDisciplineIcon(discipline: string): string {
  const disciplineInfo = disciplines[discipline];
  return disciplineInfo?.icon || "/icons/disciplines/default.svg";
}

// Утилита для получения всех дисциплин
export function getAllDisciplines(): string[] {
  return Object.keys(disciplines);
}