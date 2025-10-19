// Типы для работы с этапами турнира

/**
 * Данные формы создания этапа
 */
export interface StageFormData {
  tournament: string;      // ID турнира
  title: string;           // Название этапа
  mechanic: string;        // UUID механики
  status: string;          // UUID статуса
  order: number;           // Порядковый номер
}

/**
 * Payload для создания этапа через SDK (с техническими именами col_xxx)
 */
export interface StageCreatePayload {
  col_e2c5584fde: string;   // tournament
  col_7ef90ab5ee: string;   // title
  col_9d5ca1d664: string;   // mechanic
  col_04f88e07b9: string;   // status
  col_c4660c0e50: number;   // order
  col_a9048c1624?: any[];   // tours (пустой массив)
  col_da148c8009?: any[];   // tournaments_teams_stages (пустой массив)
}

/**
 * Ответ от Server Action
 */
export interface StageCreateResponse {
  success: boolean;
  data?: {
    _id: string;
    createdAt: string;
    [key: string]: any;
  };
  error?: string;
}

/**
 * Минимальная информация о турнире для селекта
 */
export interface TournamentOption {
  id: string;
  title: string;
}
