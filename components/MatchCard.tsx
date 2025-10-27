"use client";

import { getDisciplineIconById } from "@/lib/disciplines";
import { MATCH_STATUS_COLORS } from "@/lib/match-statuses";

export interface MatchCardProps {
  matchId: string;              // ID матча
  team1: string;                // Название команды 1
  team2: string;                // Название команды 2
  stageName: string;            // Название этапа
  tourName: string;             // Название тура
  discipline: string;           // ID дисциплины для иконки
  dateStart: string;            // ISO дата начала
  dateEnd: string;              // ISO дата окончания
  statusDisplay: string;        // Текст статуса
  statusColor: 'gray' | 'blue' | 'yellow' | 'red' | 'green'; // Цвет статуса
  onViewDetails?: (matchId: string) => void;
}

export default function MatchCard({
  matchId,
  team1,
  team2,
  stageName,
  tourName,
  discipline,
  dateStart,
  dateEnd,
  statusDisplay,
  statusColor,
  onViewDetails,
}: MatchCardProps) {
  const handleArrowClick = () => {
    if (onViewDetails) {
      onViewDetails(matchId);
    }
  };

  // Получаем цвета для статуса
  const statusColors = MATCH_STATUS_COLORS[statusColor];

  // Формат отображения турнира: "Этап (Тур)"
  const tournamentDisplay = `${stageName} (${tourName})`;

  // Форматируем дату и время
  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month} ${hours}:${minutes}`;
  };

  const startDisplay = formatDateTime(dateStart);
  const endDisplay = formatDateTime(dateEnd);

  return (
    <div className="
      flex flex-col justify-center items-center
      p-4 gap-2 isolate
      w-full max-w-[800px] h-auto min-h-[80px]
      bg-[#3A4153] border border-[#4A5568] rounded-[10px]
      relative mx-auto shadow-lg
    ">
      {/* Первая строка - команды, статус, кнопка */}
      <div className="flex items-center justify-between w-full gap-4">
        {/* Левая часть - команды */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="
            text-white text-[14px] font-bold
            bg-gradient-to-r from-blue-600/30 to-purple-600/30 
            border border-blue-400/40 px-3 py-1.5 rounded-[6px]
            shadow-lg
          ">
            🏆 {team1}
          </span>
          <span className="
            text-white font-bold text-[16px] leading-[100%]
            px-2
          ">
            VS
          </span>
          <span className="
            text-white text-[14px] font-bold
            bg-gradient-to-r from-blue-600/30 to-purple-600/30 
            border border-blue-400/40 px-3 py-1.5 rounded-[6px]
            shadow-lg
          ">
            🏆 {team2}
          </span>
        </div>
        
        {/* Правая часть - статус и кнопка */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`
            text-[13px] font-medium px-3 py-1.5 rounded-[6px]
            ${statusColors.bg} ${statusColors.border} ${statusColors.text}
            border whitespace-nowrap
          `}>
            {statusDisplay}
          </span>
          
          <button
            onClick={handleArrowClick}
            className="
              w-8 h-8
              flex items-center justify-center
              bg-blue-500/10 border border-blue-500/30 rounded-[6px]
              text-blue-400 hover:text-blue-300 hover:bg-blue-500/20
              transition-all duration-200
            "
            title="Подробнее о матче"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-current"
            >
              <path 
                d="M9 18L15 12L9 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Вторая строка - турнир, дисциплина, время */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Левая часть - турнир и дисциплина */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="
            text-orange-400 text-[12px] font-medium
            bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded-[4px]
            whitespace-nowrap
          " title={tournamentDisplay}>
            🏟️ {tournamentDisplay}
          </span>
          
          <span className="text-gray-400 text-[12px]">•</span>
          
          {/* Иконка дисциплины */}
          <div className="flex items-center gap-1">
            <img 
              src={getDisciplineIconById(discipline)} 
              alt="discipline"
              className="w-6 h-6"
              title={discipline}
            />
          </div>
        </div>

        {/* Правая часть - время */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="
            text-green-400 text-[12px] font-medium
            bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-[4px]
            whitespace-nowrap
          " title="Начало матча">
            🟢 {startDisplay}
          </span>
          <span className="text-gray-400 text-[12px]">→</span>
          <span className="
            text-red-400 text-[12px] font-medium
            bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-[4px]
            whitespace-nowrap
          " title="Окончание матча">
            🔴 {endDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}