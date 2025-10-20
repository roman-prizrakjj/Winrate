// Типы для отображения этапов в UI

export interface Stage {
  id: string;                    // _id этапа
  title: string;                 // Название этапа
  order: number;                 // Порядковый номер
  tournamentId: string;          // ID турнира
  tournamentTitle: string;       // Название турнира
  disciplineId: string;          // ID дисциплины
  disciplineName: string;        // Название дисциплины
  mechanicId: string;            // UUID механики
  mechanicName: string;          // Название механики
  statusId: string;              // UUID статуса
  statusName: string;            // Название статуса
  currentTour: {
    title: string;               // Название текущего тура
    dateStart: string;           // Дата начала (ISO string)
  } | null;                      // null если нет текущего тура
  teamsCount: number;            // Количество команд
  createdAt: string;             // Дата создания
  updatedAt: string;             // Дата обновления
}
