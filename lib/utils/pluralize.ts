/**
 * Правильное склонение слов в русском языке
 */

/**
 * Склонение существительного в зависимости от числа
 * @param count - количество
 * @param one - форма для 1 (тур, этап, матч)
 * @param two - форма для 2-4 (тура, этапа, матча)
 * @param five - форма для 5+ (туров, этапов, матчей)
 * @returns правильная форма слова
 */
export function pluralize(count: number, one: string, two: string, five: string): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Исключения: 11-14 всегда используют форму "five"
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} ${five}`;
  }

  // 1, 21, 31, 41... -> форма "one"
  if (lastDigit === 1) {
    return `${count} ${one}`;
  }

  // 2-4, 22-24, 32-34... -> форма "two"
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} ${two}`;
  }

  // 0, 5-20, 25-30... -> форма "five"
  return `${count} ${five}`;
}

/**
 * Склонение слова "тур"
 */
export function pluralizeTours(count: number): string {
  return pluralize(count, 'тур', 'тура', 'туров');
}

/**
 * Склонение слова "этап"
 */
export function pluralizeStages(count: number): string {
  return pluralize(count, 'этап', 'этапа', 'этапов');
}

/**
 * Склонение слова "матч"
 */
export function pluralizeMatches(count: number): string {
  return pluralize(count, 'матч', 'матча', 'матчей');
}

/**
 * Склонение слова "команда"
 */
export function pluralizeTeams(count: number): string {
  return pluralize(count, 'команда', 'команды', 'команд');
}
