// Типы для работы с турами

/**
 * Данные формы создания тура
 */
export interface TourFormData {
  tournament: string;      // ID турнира
  stage: string;           // ID этапа
  title: string;           // Название тура
  order: number;           // Порядковый номер
  dateStart: string;       // ISO datetime начала
  dateEnd: string;         // ISO datetime окончания
}

/**
 * Payload для создания тура через SDK (с техническими именами col_xxx)
 */
export interface TourCreatePayload {
  col_3727fe7a0f: string;   // tournament
  col_2fbf9b9970: string;   // stage
  col_740b44439e: string;   // current_stage (дублирует stage)
  col_a0023ff3ed: string;   // title
  col_afdc21ee3d: number;   // order
  col_079e4605a4: string;   // dateStart (ISO string)
  col_5685527a30: string;   // dateEnd (ISO string)
  col_83cc0eea00?: any[];   // matches (пустой массив)
  col_802246619d?: any[];   // results (пустой массив)
}

/**
 * Ответ от Server Action
 */
export interface TourCreateResponse {
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

/**
 * Минимальная информация об этапе для селекта
 */
export interface StageOption {
  id: string;
  title: string;
  order: number;
}
