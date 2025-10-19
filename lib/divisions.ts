// Дивизионы турниров
// ID из EMD Cloud коллекции дивизионов

export interface Division {
  id: string;
  name: string;
  displayName: string;
}

export const DIVISIONS: Division[] = [
  {
    id: '68d6a88d91c0a0c6c2d14d90',
    name: 'mshkl_junior',
    displayName: 'МШКЛ: Младший дивизион 5-8 Класс'
  },
  {
    id: '68d6a89391c0a0c6c2d14d91',
    name: 'mshkl_senior',
    displayName: 'МШКЛ: Старший дивизион 9-11 Класс'
  },
  {
    id: '68d6a8a8720acf5275a4f3de',
    name: 'mshkl_college',
    displayName: 'МШКЛ: Дивизион Лига Колледжей'
  },
];

// Утилиты для работы с дивизионами
export function getDivisionById(id: string): Division | undefined {
  return DIVISIONS.find(division => division.id === id);
}

export function getDivisionByName(name: string): Division | undefined {
  return DIVISIONS.find(division => division.name === name);
}

// Дивизион по умолчанию
export const DEFAULT_DIVISION_ID = '68d6a89391c0a0c6c2d14d91';
