// lib/disciplines.ts
// Информация о дисциплинах и требованиях по количеству игроков
export interface DisciplineInfo {
  id: string;
  min: number;
  max: number;
  icon: string;
  displayName?: string;
}
// Информация о дисциплинах с требованиями по количеству игроков (без капитана)
export const disciplines: Record<string, DisciplineInfo> = {
  "Counter-Strike 2": { id: "68d570defffb6787b015ebfb", min: 5, max: 7, icon: "/icons/disciplines/cs2.svg" },
  "Dota 2": { id: "68c91f2d269ae59c3507f71d", min: 5, max: 7, icon: "/icons/disciplines/dota2.svg" },
  "Fortnite": { id: "68d57160fffb6787b015ebff", min: 3, max: 4, icon: "/icons/disciplines/fortnite.svg" },
  "MLBB": { id: "68d57e8c720acf5275a4ea3d", min: 5, max: 7, icon: "/icons/disciplines/mlbb.svg" },
  "Standoff 2": { id: "68d5713b720acf5275a4e9b9", min: 5, max: 7, icon: "/icons/disciplines/standoff.svg" },
  "Strinova": { id: "68d57efbe4808eae25efbb5e", min: 5, max: 7, icon: "/icons/disciplines/strinova.svg" },
  "Valorant": { id: "68d57149e4808eae25efbb07", min: 5, max: 7, icon: "/icons/disciplines/valorant.svg" },
  "Warface": { id: "68d57ed0e4808eae25efbb5c", min: 5, max: 7, icon: "/icons/disciplines/warface.svg" },
  "Калибр": { id: "68d58044720acf5275a4ea42", min: 4, max: 5, icon: "/icons/disciplines/калибр.svg" },
  "Мир танков (Стальной охотник)": { id: "68d57159e4808eae25efbb0a", min: 1, max: 1, icon: "/icons/disciplines/мир танков.svg" },
  "Мир танков 3x3": { id: "68d57f41e4808eae25efbb61", min: 3, max: 4, icon: "/icons/disciplines/мир танков.svg" }
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

// Массив дисциплин для использования в формах/селектах
export const DISCIPLINES = Object.entries(disciplines).map(([name, info]) => ({
  ...info,
  name,
  displayName: info.displayName || name
}));