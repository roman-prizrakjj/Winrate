// Механики проведения этапов турнира
// UUID из EMD Cloud коллекции механик

export interface StageMechanic {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

export const STAGE_MECHANICS: StageMechanic[] = [
  {
    id: '250614e6-1142-4604-b950-fd81c7a66497',
    name: 'swiss',
    displayName: 'Швейцарская система',
    description: 'Команды играют одинаковое количество раундов, встречаясь с равными по силе соперниками'
  },
  {
    id: '41adb457-1fe4-4277-ad26-d53f2f2ba892',
    name: 'single_elimination',
    displayName: 'Single Elimination',
    description: 'Одно поражение - выбывание из турнира (олимпийская система)'
  },
  {
    id: '1a640e59-f12f-4c0f-b8a4-4e4022c9cfff',
    name: 'double_elimination',
    displayName: 'Double Elimination',
    description: 'Команда выбывает после двух поражений (верхняя и нижняя сетка)'
  }
];

// Механика по умолчанию для новых этапов
export const DEFAULT_MECHANIC_ID = '250614e6-1142-4604-b950-fd81c7a66497'; // Швейцарская система

/**
 * Получить механику по ID
 */
export function getMechanicById(id: string): StageMechanic | undefined {
  return STAGE_MECHANICS.find(mechanic => mechanic.id === id);
}

/**
 * Получить механику по имени
 */
export function getMechanicByName(name: string): StageMechanic | undefined {
  return STAGE_MECHANICS.find(mechanic => mechanic.name === name);
}
