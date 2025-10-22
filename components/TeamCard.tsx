'use client';

import { Team, Player } from '@/lib/types/teams';
import { useState } from 'react';
import { getTeamStatus, getDisciplineRequirement, disciplines } from '@/lib/disciplines';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Определяем статус команды на основе дисциплины
  const teamStatus = getTeamStatus(team.players.length, team.discipline || 'Unknown');
  const requirementText = getDisciplineRequirement(team.discipline || 'Unknown');

  const getButtonStyle = () => {
    switch (teamStatus) {
      case 'incomplete':
        return 'bg-red-600 hover:bg-red-700';
      case 'complete':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'full':
        return 'bg-[#2581FF] hover:bg-[#1a6ad9]';
      case 'overstaffed':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getButtonText = () => {
    switch (teamStatus) {
      case 'incomplete':
        return 'Неполный состав';
      case 'complete':
        return 'Состав';
      case 'full':
        return 'Полный состав';
      case 'overstaffed':
        return 'Переукомплектован';
      default:
        return 'Состав';
    }
  };

  return (
    <>
      <div className="
        flex flex-col justify-center items-center
        p-4 gap-2 isolate
        w-full max-w-[800px] h-auto min-h-[80px]
        bg-[#3A4153] border border-[#4A5568] rounded-[10px]
        relative mx-auto shadow-lg
      ">
        {/* Первая строка - основная информация и кнопка */}
        <div className="flex items-center justify-between w-full gap-4">
          {/* Левая часть - название, университет, дисциплина */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="
              text-white text-[14px] font-bold
              bg-gradient-to-r from-blue-600/30 to-purple-600/30 
              border border-blue-400/40 px-3 py-1.5 rounded-[6px]
              whitespace-nowrap shadow-lg
            ">
              🏆 {team.name}
            </span>
            <span className="
              text-gray-300 text-[12px] font-medium
              bg-gray-600/20 border border-gray-500/30 px-2 py-1 rounded-[4px]
              whitespace-nowrap
            ">
              🏫 {team.school}
            </span>
            <span className="
              text-blue-400 text-[12px] font-medium
              bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-[4px]
              whitespace-nowrap
            ">
              🎮 {team.discipline}
            </span>
          </div>
          
          {/* Правая часть - кнопка состава */}
          <button
            onClick={openModal}
            className={`
              flex justify-center items-center
              px-4 py-2 gap-2 flex-shrink-0
              ${getButtonStyle()} rounded-[8px]
              text-white font-medium text-[14px]
              transition-colors duration-200
            `}
          >
            {getButtonText()}
          </button>
        </div>

        {/* Вторая строка - информация о составе */}
        <div className="flex items-center w-full">
          <span className="
            text-green-400 text-[12px] font-medium
            bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-[4px]
            whitespace-nowrap
          ">
            👥 Состав: {team.players.length} из {requirementText}
          </span>
        </div>
      </div>

      {/* Модальное окно с составом */}
      {isModalOpen && (
        <div className="
          fixed inset-0 bg-black bg-opacity-50 
          flex items-center justify-center z-[9999]
          p-4
        ">
          <div className="
            bg-[#282E3B] rounded-[10px] shadow-2xl
            max-w-md w-full p-6
            relative
          ">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="
                text-white font-bold text-[20px] leading-[100%]
              ">
                Состав команды {team.name}
              </h2>
              <button
                onClick={closeModal}
                className="
                  text-white/60 hover:text-white
                  text-2xl leading-none
                  transition-colors duration-200
                "
              >
                ×
              </button>
            </div>

            {/* Информация о команде */}
            <div className="mb-4 p-3 bg-[#1a1f2e] rounded-[8px]">
              <p className="text-white/60 text-[14px] mb-1">Университет</p>
              <p className="text-white text-[16px] font-medium">{team.school}</p>
            </div>

            {/* Список игроков */}
            <div className="space-y-3">
              <h3 className="text-white font-medium text-[16px] mb-3">
                Игроки ({team.players.length})
              </h3>
              {team.players
                .sort((a, b) => {
                  // Сортировка: Капитан → Игрок → Запасной
                  const roleOrder: Record<string, number> = {
                    'captain': 1,
                    'player': 2,
                    'substitute': 3,
                  };
                  return (roleOrder[a.role] || 999) - (roleOrder[b.role] || 999);
                })
                .map((player, index) => {
                  // Маппинг ролей на русские названия
                  const roleMap: Record<string, string> = {
                    'captain': 'Капитан',
                    'player': 'Игрок',
                    'substitute': 'Запасной',
                  };
                  
                  const roleDisplayName = roleMap[player.role] || player.role;

                  // Определяем цвет бейджа в зависимости от роли
                  const getRoleBadgeStyle = (role: string) => {
                    switch (role) {
                      case 'captain':
                        return 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400';
                      case 'player':
                        return 'bg-blue-500/20 border border-blue-500/40 text-blue-400';
                      case 'substitute':
                        return 'bg-gray-500/20 border border-gray-500/40 text-gray-400';
                      default:
                        return 'bg-gray-500/20 border border-gray-500/40 text-gray-400';
                    }
                  };

                  // Иконки для ролей
                  const getRoleIcon = (role: string) => {
                    switch (role) {
                      case 'captain':
                        return '👑';
                      case 'player':
                        return '⭐';
                      case 'substitute':
                        return '🔄';
                      default:
                        return '❓';
                    }
                  };

                  return (
                    <div 
                      key={index} 
                      className="
                        flex items-center justify-between
                        p-3 bg-[#1a1f2e] rounded-[8px]
                        hover:bg-[#232833] transition-colors duration-200
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div className="
                          w-8 h-8 bg-[#2581FF] rounded-full
                          flex items-center justify-center
                          text-white font-bold text-[12px]
                        ">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-[16px]">{player.nickname}</span>
                          {player.role === 'captain' && player.telegram && (
                            <a
                              href={`https://t.me/${player.telegram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-[12px] transition-colors"
                            >
                              📱 Telegram
                            </a>
                          )}
                        </div>
                      </div>
                      <span className={`
                        text-[12px] font-medium
                        px-3 py-1 rounded-full
                        flex items-center gap-1
                        ${getRoleBadgeStyle(player.role)}
                      `}>
                        <span>{getRoleIcon(player.role)}</span>
                        <span>{roleDisplayName}</span>
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Кнопка закрытия */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="
                  bg-[#2581FF] hover:bg-[#1a6ad9] 
                  text-white font-medium text-[14px]
                  px-6 py-2 rounded-[8px]
                  transition-colors duration-200
                "
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}