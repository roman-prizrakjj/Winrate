'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CreateTournamentModal from '@/components/CreateTournamentModal';
import CreateStageModal from '@/components/CreateStageModal';

export default function CreatePage() {
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  const cards = [
    {
      id: 'tournament',
      icon: '🏆',
      title: 'Создать турнир',
      description: 'Создание нового турнира с настройками',
      onClick: () => setIsTournamentModalOpen(true),
      enabled: true,
    },
    {
      id: 'stages',
      icon: '📊',
      title: 'Создать этап турнира',
      description: 'Добавление этапа к существующему турниру',
      onClick: () => setIsStageModalOpen(true),
      enabled: true,
    },
    {
      id: 'tour',
      icon: '🎯',
      title: 'Создать тур',
      description: 'Создание тура внутри этапа',
      onClick: () => {},
      enabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок с навигацией */}
        <div className="mb-8">
          <Header activeTab="create" />
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-[#282E3B] backdrop-blur-[21px] rounded-[10px] p-8 flex flex-col items-center text-center"
            >
              {/* Иконка */}
              <div className="text-6xl mb-4">
                {card.icon}
              </div>

              {/* Заголовок */}
              <h3 className="text-white text-xl font-bold mb-3">
                {card.title}
              </h3>

              {/* Описание */}
              <p className="text-gray-400 text-sm mb-6">
                {card.description}
              </p>

              {/* Кнопка */}
              <button
                disabled={!card.enabled}
                onClick={card.onClick}
                className={`
                  w-full px-6 py-3 rounded-[10px]
                  font-medium text-sm
                  transition-all duration-200
                  ${card.enabled 
                    ? 'bg-[#2581FF] text-white hover:bg-[#2581FF]/90 cursor-pointer' 
                    : 'bg-[#2581FF]/20 text-[#2581FF]/40 cursor-not-allowed'
                  }
                `}
              >
                {card.enabled ? 'Создать' : 'В разработке'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка создания турнира */}
      <CreateTournamentModal 
        isOpen={isTournamentModalOpen} 
        onClose={() => setIsTournamentModalOpen(false)} 
      />

      {/* Модалка создания этапа */}
      <CreateStageModal 
        isOpen={isStageModalOpen} 
        onClose={() => setIsStageModalOpen(false)} 
      />
    </div>
  );
}
