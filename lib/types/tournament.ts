// Типы для работы с турнирами

// Данные формы создания турнира (читаемые поля)
export interface TournamentFormData {
  title: string;
  status: string;           // UUID статуса
  description: string;
  rules: string;
  discipline: string;       // ID дисциплины
  division: string;         // ID дивизиона
  parent_id?: string | null;
  has_fastcup?: boolean;
  showOnPlatform?: boolean;
}

// Данные для отправки в EMD Cloud (технические имена col_xxx)
export interface TournamentCreatePayload {
  col_edf500ac9f: string;              // title
  col_e573271bf6: string;              // status
  col_646c0d8168: string;              // description
  col_0db1a5550a: string;              // rules
  col_92ec3ffcd5: string;              // discipline
  col_c700785317: string;              // division
  col_920699b1c2?: string | null;      // parent_id
  col_016711397c?: boolean;            // has_fastcup
  col_7889da834e?: boolean;            // showOnPlatform
}

// Ответ от сервера после создания турнира
export interface TournamentCreateResponse {
  success: boolean;
  data?: {
    _id: string;
    createdAt: string;
    updatedAt: string;
    data: {
      col_edf500ac9f: string;  // title
      col_e573271bf6: string;  // status
      [key: string]: any;
    };
  };
  error?: string;
}

// Данные турнира из базы (с читаемыми именами после useHumanReadableNames)
export interface Tournament {
  _id: string;
  createdAt: string;
  updatedAt: string;
  data: {
    title: string;
    status: string;
    description?: string;
    rules?: string;
    discipline?: {
      _id: string;
      data: {
        name: string;
      };
    };
    division?: {
      _id: string;
      data: {
        name: string;
      };
    };
    parent_id?: string | null;
    has_fastcup?: boolean;
    showOnPlatform?: boolean;
    tours?: any[];
    matches?: any[];
    results?: any[];
    stages?: any[];
    tournaments_teams_stages?: any[];
    tournaments_teams?: any[];
  };
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    login: string;
  };
}
