'use client';

import { useState, useMemo } from 'react';
import SearchInput from '@/components/SearchInput';
import TeamList from '@/components/TeamList';
import { Team } from '@/lib/mockData';
import { isTeamComplete, disciplines, getTeamStatus } from '@/lib/disciplines';

interface TeamsPageClientProps {
  allTeams: Team[];
}

export default function TeamsPageClient({ allTeams }: TeamsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullTeamsOnly, setShowFullTeamsOnly] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  
  // Фильтрация команд по поисковому запросу, полному составу и дисциплине
  const filteredTeams = useMemo(() => {
    let filtered = allTeams;
    
    // Фильтр по поисковому запросу
    if (searchTerm.trim()) {
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.discipline.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтр по дисциплине
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(team => team.discipline === selectedDiscipline);
    }
    
    // Фильтр по полному составу (исключаем переукомплектованные команды)
    if (showFullTeamsOnly) {
      filtered = filtered.filter(team => {
        const status = getTeamStatus(team.players.length, team.discipline);
        return status === 'complete' || status === 'full';
      });
    }
    
    return filtered;
  }, [allTeams, searchTerm, showFullTeamsOnly, selectedDiscipline]);

  return (
    <>
      {/* Контент */}
      <div className="space-y-8">
        {/* Заголовок секции и поиск */}
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Команды университетов
            </h2>
            <p className="text-white/60">
              Просмотр команд с информацией об учебных заведениях и составах игроков
            </p>
          </div>

          {/* Поле поиска */}
          <div className="flex justify-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Поиск по названию команды или университету..."
              className="w-full max-w-md"
            />
          </div>

          {/* Фильтры */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Фильтр по полному составу */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showFullTeamsOnly}
                onChange={(e) => setShowFullTeamsOnly(e.target.checked)}
                className="
                  w-4 h-4 text-[#2581FF] bg-transparent border-2 border-white/60
                  rounded focus:ring-[#2581FF] focus:ring-2
                  checked:bg-[#2581FF] checked:border-[#2581FF]
                "
              />
              <span className="text-white/80 text-[14px] font-medium">
                Показать только команды с полным составом
              </span>
            </label>

            {/* Фильтр по дисциплинам */}
            <div className="flex items-center gap-3">
              <label className="text-white/80 text-[14px] font-medium">
                Дисциплина:
              </label>
              <select 
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="
                  bg-[#282E3B] text-white border border-white/20 rounded-[8px]
                  px-3 py-2 text-[14px] min-w-[200px]
                  focus:ring-2 focus:ring-[#2581FF] focus:border-[#2581FF]
                  transition-colors duration-200
                "
              >
                <option value="all">Все дисциплины</option>
                {Object.keys(disciplines).map(discipline => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список команд */}
        <div className="bg-[#282E3B] rounded-[10px] overflow-hidden mx-4">
          {filteredTeams.length > 0 ? (
            <div className="space-y-6 p-8">
              {/* Заголовок списка */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <h3 className="text-white font-bold text-xl flex-shrink-0">
                  Список команд
                </h3>
                <div className="flex flex-col items-start sm:items-end gap-2 min-w-0 max-w-[200px] sm:max-w-[250px]">
                  {/* Общий счетчик */}
                  <div className="
                    bg-[#2581FF]/20 border border-[#2581FF]/40 
                    rounded-[8px] px-3 py-1
                    flex items-center gap-2 w-fit
                  ">
                    <div className="w-2 h-2 bg-[#2581FF] rounded-full flex-shrink-0"></div>
                    <span className="text-[#2581FF] font-medium text-sm whitespace-nowrap">
                      {filteredTeams.length} команд
                    </span>
                  </div>
                  
                  {/* Статистика составов */}
                  <div className="flex items-center gap-2 flex-wrap w-fit">
                    <div className="
                      bg-green-500/20 border border-green-500/40 
                      rounded-[6px] px-2 py-1
                      flex items-center gap-1
                    ">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-green-400 font-medium text-xs whitespace-nowrap">
                        {(selectedDiscipline === 'all' ? allTeams : allTeams.filter(team => team.discipline === selectedDiscipline))
                          .filter(team => isTeamComplete(team.players.length, team.discipline)).length}
                      </span>
                    </div>
                    
                    <div className="
                      bg-red-500/20 border border-red-500/40 
                      rounded-[6px] px-2 py-1
                      flex items-center gap-1
                    ">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-red-400 font-medium text-xs whitespace-nowrap">
                        {(selectedDiscipline === 'all' ? allTeams : allTeams.filter(team => team.discipline === selectedDiscipline))
                          .filter(team => !isTeamComplete(team.players.length, team.discipline)).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Команды */}
              <TeamList teams={filteredTeams} />
            </div>
          ) : (
            /* Пустое состояние */
            <div className="text-center py-16">
              <div className="text-white/30 text-6xl mb-6">🔍</div>
              <h3 className="text-white font-bold text-xl mb-2">
                Команды не найдены
              </h3>
              <p className="text-white/60">
                Попробуйте изменить поисковый запрос или очистить фильтры
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
