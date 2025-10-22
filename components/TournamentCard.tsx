'use client';

import { useState } from 'react';
import type { Tournament } from '@/lib/types/tournaments';
import { disciplines } from '@/lib/disciplines';
import { pluralizeTours, pluralizeStages, pluralizeMatches } from '@/lib/utils/pluralize';

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Получаем иконку дисциплины
  const disciplineInfo = Object.entries(disciplines).find(
    ([name, _]) => name === tournament.discipline.name
  );
  const disciplineIcon = disciplineInfo?.[1].icon;

  return (
    <div className="w-full bg-[#3A4153] border border-[#4A5568] rounded-[10px] shadow-lg hover:border-[#5A6578] transition-colors">
      {/* Свёрнутое состояние - кликабельная карточка */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* 1. Название турнира */}
        <div className="flex-1 min-w-0">
          <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-[#2581FF]/20 text-white border border-[#2581FF]/40 inline-block truncate max-w-full">
            {tournament.title}
          </span>
        </div>

        {/* 2. Дисциплина */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {disciplineIcon && (
            <img 
              src={disciplineIcon} 
              alt={tournament.discipline.name}
              className="w-5 h-5"
            />
          )}
          <span className="text-gray-300 text-xs">
            {tournament.discipline.name}
          </span>
        </div>

        {/* 3. Дивизион */}
        <div className="flex-shrink-0 w-48">
          <span className="text-gray-300 text-xs">
            {tournament.division.name}
          </span>
        </div>

        {/* 4. Количество туров и этапов */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {pluralizeTours(tournament.toursCount)}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {pluralizeStages(tournament.stagesCount)}
          </span>
        </div>

        {/* 5. Статус */}
        <div className="flex-shrink-0 w-48">
          <span 
            className="px-3 py-1.5 rounded-lg text-xs font-medium border inline-block"
            style={{ 
              backgroundColor: `${tournament.statusColor}20`,
              color: tournament.statusColor,
              borderColor: `${tournament.statusColor}30`
            }}
          >
            {tournament.statusName}
          </span>
        </div>

        {/* 6. Стрелка раскрытия */}
        <div className="flex-shrink-0">
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Развёрнутое состояние */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[#4A5568] mt-2 pt-4 space-y-4">
          {/* Этапы */}
          {tournament.stages.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Этапы ({tournament.stagesCount}):</h4>
              <div className="space-y-2">
                {tournament.stages.map((stage) => (
                  <div 
                    key={stage.id}
                    className="flex items-center gap-3 p-3 bg-[#282E3B] rounded-lg border border-[#4A5568]"
                  >
                    <span className="text-white/70 text-xs font-bold">#{stage.order}</span>
                    <span className="text-white text-xs flex-1">{stage.title}</span>
                    <span className="text-gray-400 text-xs">{stage.mechanic}</span>
                    <span className="px-2 py-1 rounded text-[10px] font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                      {pluralizeTours(stage.toursCount)}
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-[10px] font-medium border"
                      style={{
                        backgroundColor: `${stage.statusColor}20`,
                        color: stage.statusColor,
                        borderColor: `${stage.statusColor}30`
                      }}
                    >
                      {stage.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Туры */}
          {tournament.tours.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Туры ({tournament.toursCount}):</h4>
              <div className="space-y-2">
                {tournament.tours.map((tour) => (
                  <div 
                    key={tour.id}
                    className="flex items-center gap-3 p-3 bg-[#282E3B] rounded-lg border border-[#4A5568]"
                  >
                    <span className="text-white/70 text-xs font-bold">#{tour.order}</span>
                    <span className="text-white text-xs flex-1">{tour.title}</span>
                    <span className="px-2 py-1 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {pluralizeMatches(tour.matchesCount)}
                    </span>
                    {tour.dateStart && (
                      <span className="text-gray-400 text-[10px]">
                        {new Date(tour.dateStart).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="flex items-center gap-4 pt-2 border-t border-[#4A5568]">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs">Команд:</span>
              <span className="text-white text-xs font-semibold">{tournament.teamsCount}</span>
            </div>
            {tournament.discipline.minPlayers && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Минимум игроков:</span>
                <span className="text-white text-xs font-semibold">{tournament.discipline.minPlayers}</span>
              </div>
            )}
            {tournament.hasFastcup && (
              <div className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                FastCup
              </div>
            )}
          </div>

          {/* Описание */}
          {tournament.description && (
            <div>
              <h4 className="text-white text-sm font-semibold mb-2">Описание:</h4>
              <div 
                className="text-gray-300 text-xs leading-relaxed tournament-content"
                dangerouslySetInnerHTML={{ __html: tournament.description }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
