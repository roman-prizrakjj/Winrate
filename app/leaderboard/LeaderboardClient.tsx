'use client';

import { useState, useMemo } from 'react';
import TeamStatsTable, { TeamStats } from '@/components/TeamStatsTable';
import { getStageStatusById, STAGE_STATUS_COLORS } from '@/lib/stage-statuses';

interface Tournament {
  id: string;
  title: string;
  stageTitle: string;
  stageStatus: string;
}

interface LeaderboardClientProps {
  teams: TeamStats[];
  tournaments: Tournament[];
}

export default function LeaderboardClient({ teams, tournaments }: LeaderboardClientProps) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const handleTeamClick = (teamId: string) => {
    console.log(`Клик по команде ID: ${teamId}`);
    // Здесь можно добавить навигацию или открытие модального окна
  };

  // Находим выбранный турнир
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);
  
  // Получаем информацию о статусе этапа
  const stageStatus = selectedTournament 
    ? getStageStatusById(selectedTournament.stageStatus)
    : null;
  
  const stageColor = selectedTournament?.stageStatus 
    ? STAGE_STATUS_COLORS[selectedTournament.stageStatus] || '#6B7280'
    : '#6B7280';

  // Фильтрация команд по турниру
  const filteredTeams = useMemo(() => {
    if (!selectedTournamentId) return teams;
    
    const filtered = teams.filter(team => team.tournamentId === selectedTournamentId);
    
    // Пересчитываем позиции после фильтрации
    return filtered.map((team, index) => ({
      ...team,
      position: index + 1
    }));
  }, [teams, selectedTournamentId]);

  return (
    <div className="space-y-6">
      {/* Фильтр по турниру */}
      <div className="bg-[#3A4153] border border-[#4A5568] rounded-lg p-4">
        <label className="block text-white text-sm font-medium mb-2">
          Выберите турнир:
        </label>
        <select
          value={selectedTournamentId || ''}
          onChange={(e) => setSelectedTournamentId(e.target.value || null)}
          className="w-full bg-[#282E3B] text-white border border-[#4A5568] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все турниры</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.title}
            </option>
          ))}
        </select>

        {/* Бейдж текущего этапа */}
        {selectedTournament && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-white/60 text-sm">Текущий этап:</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {selectedTournament.stageTitle}
              </span>
              {stageStatus && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: stageColor }}
                >
                  {stageStatus.displayName}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Заголовок */}
      <div className="text-center space-y-4">
        <h2 className="text-white text-2xl font-bold mb-2">
          Рейтинг команд
        </h2>
        <p className="text-white/60">
          {selectedTournament 
            ? `Статистика команд в турнире "${selectedTournament.title}"`
            : 'Статистика команд по всем турнирам'}
        </p>
      </div>

      {/* Таблица */}
      {filteredTeams.length > 0 ? (
        <TeamStatsTable 
          teams={filteredTeams} 
          onTeamClick={handleTeamClick}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">
            {selectedTournamentId 
              ? 'В выбранном турнире нет команд'
              : 'Нет данных о командах'}
          </p>
        </div>
      )}
    </div>
  );
}
