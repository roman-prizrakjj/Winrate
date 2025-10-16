"use client";

import { useState } from "react";
import EditMatchModal from "./EditMatchModal";
import { getDisciplineIcon } from "@/lib/disciplines";

export interface MatchCardProps {
  team1: string;
  team2: string;
  tournament: string;
  datetime: string;
  discipline: string; // Название дисциплины из disciplines.ts
  gameIcon?: string; // URL для иконки игры (deprecated)
  onViewDetails?: () => void;
  onUpdateMatch?: (team1: string, team2: string) => void;
}

export default function MatchCard({
  team1,
  team2,
  tournament,
  datetime,
  discipline,
  gameIcon,
  onViewDetails,
  onUpdateMatch,
}: MatchCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArrowClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSave = (newTeam1: string, newTeam2: string) => {
    if (onUpdateMatch) {
      onUpdateMatch(newTeam1, newTeam2);
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // Доступные команды для выбора (в реальном приложении будут из API)
  const availableTeams = [
    { id: "1", name: "Team Alpha" },
    { id: "2", name: "Team Beta" },
    { id: "3", name: "Team Gamma" },
    { id: "4", name: "Team Delta" },
    { id: "5", name: "Team Epsilon" },
    { id: "6", name: team1 }, // Текущие команды
    { id: "7", name: team2 },
  ].filter((team, index, self) => 
    index === self.findIndex(t => t.name === team.name) // Убираем дубликаты
  );
  return (
    <div className="
      flex flex-col justify-center items-center
      p-2 gap-2 isolate
      w-full max-w-[646px] h-[112px]
      bg-[#282E3B] rounded-[10px]
      relative
    ">
      {/* Основная информация о матче */}
      <div className="
        flex items-center justify-between
        w-full h-[50px] px-4 gap-4
        z-0
      ">
        {/* Команда 1 */}
        <div className="flex-1 flex justify-end">
          <span className="
            text-white text-[14px] font-bold
            bg-gradient-to-r from-blue-600/30 to-purple-600/30 
            border border-blue-400/40 px-2 py-1 rounded-[6px]
            whitespace-nowrap shadow-sm
          ">
            🏆 {team1}
          </span>
        </div>

        {/* Аватары команд */}
        <div className="flex items-center gap-2">
          <div className="
            w-[50px] h-[50px] rounded-full
            bg-gray-300 border-2 border-white/10
            backdrop-blur-[21px]
            flex items-center justify-center
            text-xs text-gray-600
          ">
            T1
          </div>

          <div className="
            text-white font-bold text-[20px] leading-[100%]
            text-center w-[50px]
          ">
            VS
          </div>

          <div className="
            w-[50px] h-[50px] rounded-full
            bg-gray-300 border-2 border-white/10
            backdrop-blur-[21px]
            flex items-center justify-center
            text-xs text-gray-600
          ">
            T2
          </div>
        </div>

        {/* Команда 2 */}
        <div className="flex-1 flex justify-start">
          <span className="
            text-white text-[14px] font-bold
            bg-gradient-to-r from-blue-600/30 to-purple-600/30 
            border border-blue-400/40 px-2 py-1 rounded-[6px]
            whitespace-nowrap shadow-sm
          ">
            🏆 {team2}
          </span>
        </div>
      </div>

      {/* Разделитель */}
      <div className="w-full px-4">
        <div className="h-[2px] bg-white/10 z-10" />
      </div>

      {/* Информация о турнире и времени */}
      <div className="
        flex items-center justify-between
        w-full h-[20px] px-4 gap-2
        z-20
      ">
        {/* Название турнира и дисциплина слева */}
        <div className="flex-1 flex items-center gap-2 justify-start">
          <span className="
            text-orange-400 text-[12px] font-medium
            bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded-[4px]
            whitespace-nowrap
          ">
            🏟️ {tournament}
          </span>
          
          {/* Иконка дисциплины */}
          <div className="flex items-center gap-1">
            <img 
              src={getDisciplineIcon(discipline)} 
              alt={discipline}
              className="w-8 h-8"
              title={discipline}
            />
          </div>
        </div>

        {/* Время и стрелочка справа */}
        <div className="flex items-center gap-2">
          <div className="
            text-[#2581FF] font-medium text-[15px] leading-5
            whitespace-nowrap
          ">
            {datetime}
          </div>
          
          {/* Аккуратная стрелочка */}
          <button
            onClick={handleArrowClick}
            className="
              w-5 h-5
              flex items-center justify-center
              text-white/50 hover:text-[#2581FF]
              transition-colors duration-200
            "
            title="Редактировать матч"
          >
              <svg 
                width="12" 
                height="12" 
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

      {/* Модальное окно для редактирования матча */}
      <EditMatchModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onSave={handleModalSave}
        currentTeam1={team1}
        currentTeam2={team2}
        availableTeams={availableTeams}
      />
    </div>
  );
}