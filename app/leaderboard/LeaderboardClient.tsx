'use client';

import TeamStatsTable, { TeamStats } from '@/components/TeamStatsTable';

interface LeaderboardClientProps {
  teams: TeamStats[];
}

export default function LeaderboardClient({ teams }: LeaderboardClientProps) {
  const handleTeamClick = (teamId: string) => {
    console.log(`Клик по команде ID: ${teamId}`);
    // Здесь можно добавить навигацию или открытие модального окна
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-white text-2xl font-bold mb-2">
          Рейтинг команд
        </h2>
        <p className="text-white/60">
          Статистика команд по результатам турниров
        </p>
      </div>

      {teams.length > 0 ? (
        <TeamStatsTable 
          teams={teams} 
          onTeamClick={handleTeamClick}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">
            Нет данных о командах
          </p>
        </div>
      )}
    </div>
  );
}
