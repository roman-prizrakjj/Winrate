// Утилиты для генерации mock данных
import { disciplines } from './disciplines';

export interface Match {
  id: string;
  team1: string;
  team2: string;
  tournament: string;
  datetime: string;
  discipline: string;
  gameIcon?: string;
}

export interface Player {
  name: string;
  role?: string;
}

export interface Team {
  id: number;
  name: string;
  school: string;
  wins: number;
  losses: number;
  winrate: number;
  s: number;
  players: Player[];
  discipline: string;
}

export interface TeamStats {
  id: string;
  position: number;
  name: string;
  avatar?: string;
  wins: number;
  losses: number;
  draws: number;
  i: number;
  cb: number;
  s: number;
  winrate: number;
}

// Базовые данные для генерации
const TEAM_NAMES = [
  'Natus Vincere', 'Team Spirit', 'Virtus.pro', 'Gambit Esports',
  'Outsiders', 'Cloud9', 'BIG', 'G2 Esports', 'FaZe Clan', 
  'Team Liquid', 'ENCE', 'Heroic', 'Astralis', 'FURIA',
  'Team Alpha', 'Team Beta', 'Dragons', 'Phoenix', 'Lightning',
  'Thunder', 'Cyber Warriors', 'Digital Legends', 'Esports Elite',
  'Gaming Masters', 'Pro Gamers', 'Elite Squad', 'Victory Team',
  'Champion Crew', 'Legends Club', 'Masters United'
];

const TOURNAMENTS = [
  'МШКЛ 5 сезон | Dota 2, 5x5',
  'CS:GO Major Championship',
  'Valorant Champions Tour',
  'League of Legends World Championship',
  'BLAST Premier Spring',
  'ESL Pro League',
  'DreamHack Masters',
  'IEM Katowice',
  'PGL Major Stockholm'
];

const GAME_ICONS = [
  'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/dota2_icon.png',
  'https://static-cdn.jtvnw.net/ttv-boxart/32399_IGDB-188x250.jpg', // CS:GO
  'https://static-cdn.jtvnw.net/ttv-boxart/516575-188x250.jpg', // Valorant
];

const SCHOOLS = [
  'МГТУ им. Баумана',
  'МГУ им. Ломоносова', 
  'СПБГУ',
  'МФТИ',
  'ВШЭ',
  'ИТМО',
  'МАИ',
  'МИРЭА',
  'РУДН',
  'СПбПУ',
  'УрФУ',
  'НГУ',
  'ТГУ',
  'КФУ',
  'ЮФУ'
];

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const PLAYER_NAMES = [
  'zont1x', 'sh1ro', 'nafany', 'qikert', 'Hobbit',
  's1mple', 'electronic', 'flamie', 'Boombl4', 'Perfecto',
  'ZywOo', 'RpK', 'apEX', 'shox', 'NBK',
  'device', 'Astralis', 'dupreeh', 'Xyp9x', 'gla1ve',
  'NiKo', 'huNter', 'nexa', 'AmaNEk', 'JaCkz',
  'Player1', 'Player2', 'Player3', 'Player4', 'Player5',
  'ProGamer', 'CyberHero', 'EliteShot', 'GameMaster', 'SkillKing'
];

const PLAYER_ROLES = ['Капитан', 'Снайпер', 'Поддержка', 'Разведчик'];

// Генератор состава команды
const generateTeamPlayers = (count?: number): Player[] => {
  const shuffledNames = [...PLAYER_NAMES].sort(() => Math.random() - 0.5);
  const players: Player[] = [];
  
  // Используем переданное количество или случайное от 2 до 5
  const playerCount = count ?? (Math.floor(Math.random() * 4) + 2);
  
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name: shuffledNames[i] || `Player${i + 1}`,
      // Первый игрок всегда капитан, остальные могут иметь роли или не иметь
      role: i === 0 
        ? 'Капитан' 
        : (Math.random() > 0.7 ? PLAYER_ROLES[Math.floor(Math.random() * PLAYER_ROLES.length)] : undefined)
    });
  }
  
  return players;
};

// Генератор случайного времени
const generateRandomTime = (baseDay: number): string => {
  const day = baseDay + Math.floor(Math.random() * 30);
  const hour = 10 + Math.floor(Math.random() * 12); // 10-21
  const minute = Math.floor(Math.random() * 4) * 15; // 00, 15, 30, 45
  const month = MONTHS[Math.floor(Math.random() * MONTHS.length)];
  
  return `${day} ${month} в ${hour}:${minute.toString().padStart(2, '0')}`;
};

// Генератор уникальных пар команд
const generateUniqueTeamPair = (usedPairs: Set<string>, teamNames: string[]): [string, string] => {
  let team1: string, team2: string, pairKey: string;
  
  do {
    team1 = teamNames[Math.floor(Math.random() * teamNames.length)];
    team2 = teamNames[Math.floor(Math.random() * teamNames.length)];
    pairKey = [team1, team2].sort().join('-');
  } while (team1 === team2 || usedPairs.has(pairKey));
  
  usedPairs.add(pairKey);
  return [team1, team2];
};

/**
 * Генерирует mock данные для матчей
 * @param count - количество матчей для генерации
 * @returns массив матчей
 */
export const generateMockMatches = (count: number): Match[] => {
  const usedPairs = new Set<string>();
  const disciplineNames = Object.keys(disciplines);
  
  return Array.from({ length: count }, (_, i) => {
    const [team1, team2] = generateUniqueTeamPair(usedPairs, TEAM_NAMES);
    
    return {
      id: (i + 1).toString(),
      team1,
      team2,
      tournament: TOURNAMENTS[Math.floor(Math.random() * TOURNAMENTS.length)],
      datetime: generateRandomTime(1),
      discipline: disciplineNames[Math.floor(Math.random() * disciplineNames.length)],
      gameIcon: GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)]
    };
  });
};

/**
 * Генерирует mock данные для команд с реалистичной статистикой
 * @param count - количество команд для генерации
 * @returns массив команд с статистикой
 */
export const generateMockTeams = (count: number): TeamStats[] => {
  // Перемешиваем команды для случайного порядка
  const shuffledTeams = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
  
  return Array.from({ length: count }, (_, index) => {
    // Генерируем реалистичную статистику
    const totalGames = 20 + Math.floor(Math.random() * 30); // 20-50 игр
    const winRate = 30 + Math.random() * 40; // 30-70% винрейт
    const wins = Math.floor(totalGames * (winRate / 100));
    const losses = Math.floor((totalGames - wins) * 0.7); // 70% от оставшихся - поражения
    const draws = totalGames - wins - losses; // остальное - ничьи
    
    // Дополнительные метрики
    const iMetric = Math.floor(Math.random() * 25) + 5; // 5-30
    const cb = Math.floor(Math.random() * 20) + 10; // 10-30
    const s = Math.floor(Math.random() * 15) + 8; // 8-23
    
    return {
      id: (index + 1).toString(),
      position: index + 1,
      name: shuffledTeams[index % shuffledTeams.length] || `Команда ${index + 1}`,
      wins,
      losses,
      draws,
      i: iMetric,
      cb,
      s,
      winrate: Math.round(winRate)
    };
  }).sort((a, b) => {
    // Первичная сортировка по winrate (по убыванию)
    if (b.winrate !== a.winrate) {
      return b.winrate - a.winrate;
    }
    // Вторичная сортировка по s (по убыванию) при одинаковом winrate
    return b.s - a.s;
  }) // Сортируем по винрейту, затем по s
    .map((team, index) => ({ ...team, position: index + 1 })); // Обновляем позиции
};

/**
 * Генерирует mock данные для команд Dashboard 3 (с составом игроков)
 * @param count - количество команд для генерации
 * @returns массив команд с составом
 */
export const generateTeamsWithPlayers = (count: number): Team[] => {
  const shuffledTeams = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
  const shuffledSchools = [...SCHOOLS].sort(() => Math.random() - 0.5);
  const disciplineNames = Object.keys(disciplines);
  
  return Array.from({ length: count }, (_, index) => {
    const totalGames = 20 + Math.floor(Math.random() * 30);
    const winRate = 30 + Math.random() * 40;
    const wins = Math.floor(totalGames * (winRate / 100));
    const losses = Math.floor((totalGames - wins) * 0.7);
    
    // Выбираем случайную дисциплину
    const discipline = disciplineNames[Math.floor(Math.random() * disciplineNames.length)];
    const disciplineInfo = disciplines[discipline];
    
    // Генерируем количество игроков БЕЗ капитана в пределах требований дисциплины
    const minPlayersWithoutCaptain = disciplineInfo.min;
    const maxPlayersWithoutCaptain = disciplineInfo.max;
    const playersWithoutCaptainCount = Math.floor(Math.random() * (maxPlayersWithoutCaptain - minPlayersWithoutCaptain + 1)) + minPlayersWithoutCaptain;
    
    // Общее количество = капитан + игроки
    const totalPlayerCount = playersWithoutCaptainCount + 1; // +1 капитан
    
    // Создаем различные варианты команд для разнообразия
    const randomType = Math.random();
    let finalPlayerCount: number;
    
    if (randomType < 0.2) {
      // 20% неполных команд
      finalPlayerCount = Math.max(1, Math.floor(Math.random() * totalPlayerCount));
    } else if (randomType < 0.3) {
      // 10% переукомплектованных команд (больше максимума)
      const overstaffCount = Math.floor(Math.random() * 3) + 1; // +1 до +3 лишних игроков
      finalPlayerCount = totalPlayerCount + overstaffCount;
    } else {
      // 70% нормальных команд (полных или почти полных)
      finalPlayerCount = totalPlayerCount;
    }
    
    return {
      id: index + 1,
      name: shuffledTeams[index % shuffledTeams.length] || `Команда ${index + 1}`,
      school: shuffledSchools[index % shuffledSchools.length],
      wins,
      losses,
      winrate: Math.round(winRate),
      s: Math.floor(Math.random() * 15) + 8,
      players: generateTeamPlayers(finalPlayerCount),
      discipline
    };
  }).sort((a, b) => {
    if (b.winrate !== a.winrate) {
      return b.winrate - a.winrate;
    }
    return b.s - a.s;
  });
};