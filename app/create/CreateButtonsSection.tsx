'use client';

import { useState } from 'react';
import Image from 'next/image';
import CreateTournamentModal from '@/components/CreateTournamentModal';
import CreateStageModal from '@/components/CreateStageModal';
import CreateTourModal from '@/components/CreateTourModal';

export default function CreateButtonsSection() {
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  const cards = [
    {
      id: 'tournament',
      iconPath: '/icons/create/tournaments.svg',
      title: 'Создать турнир',
      description: 'Создание нового турнира с настройками',
      onClick: () => setIsTournamentModalOpen(true),
      enabled: true,
    },
    {
      id: 'stages',
      iconPath: '/icons/create/stages.svg',
      title: 'Создать этап турнира',
      description: 'Добавление этапа к существующему турниру',
      onClick: () => setIsStageModalOpen(true),
      enabled: true,
    },
    {
      id: 'tour',
      iconPath: '/icons/create/tour.svg',
      title: 'Создать тур',
      description: 'Создание тура внутри этапа',
      onClick: () => setIsTourModalOpen(true),
      enabled: true,
    },
  ];

  return (
    <>
      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#282E3B] backdrop-blur-[21px] rounded-[10px] p-8 flex flex-col items-center text-center"
          >
            {/* Иконка */}
            <div className="mb-4 flex items-center justify-center w-16 h-16">
              <Image
                src={card.iconPath}
                alt={card.title}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
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

      {/* Модалки */}
      <CreateTournamentModal 
        isOpen={isTournamentModalOpen} 
        onClose={() => setIsTournamentModalOpen(false)} 
      />

      <CreateStageModal 
        isOpen={isStageModalOpen} 
        onClose={() => setIsStageModalOpen(false)} 
      />

      <CreateTourModal 
        isOpen={isTourModalOpen} 
        onClose={() => setIsTourModalOpen(false)} 
      />
    </>
  );
}
