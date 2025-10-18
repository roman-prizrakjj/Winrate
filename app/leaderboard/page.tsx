"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TeamStatsTable, { TeamStats } from "@/components/TeamStatsTable";
import { getTeamStats, type TeamStatsResponse } from "@/lib/api/team-stats";

interface DashboardData {
  teams: TeamStats[];
}

export default function LeaderboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем реальные данные из MongoDB
        const statsData = await getTeamStats();
        
        // Преобразуем в формат TeamStats с расчетом winrate и позиции
        const teamsWithStats: TeamStats[] = statsData.map((item: TeamStatsResponse) => {
          const gamesPlayed = item.wins + item.losses;
          const winrate = gamesPlayed > 0 
            ? Math.round((item.wins / gamesPlayed) * 100) 
            : 0;
          
          return {
            id: item.id,
            position: 0, // Будет установлено после сортировки
            name: item.name,
            wins: item.wins,
            losses: item.losses,
            draws: item.draws,
            i: item.i,
            cb: item.cb,
            s: item.s,
            winrate: winrate
          };
        });
        
        // Сортируем по winrate (от большего к меньшему)
        teamsWithStats.sort((a, b) => {
          if (b.winrate !== a.winrate) {
            return b.winrate - a.winrate;
          }
          // Если winrate одинаковый, сортируем по CB (Бухгольцу)
          if (b.cb !== a.cb) {
            return b.cb - a.cb;
          }
          // Если и CB одинаковый, сортируем по очкам (s)
          return b.s - a.s;
        });
        
        // Устанавливаем позиции
        teamsWithStats.forEach((team, index) => {
          team.position = index + 1;
        });
        
        setData({ teams: teamsWithStats });
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTeamClick = (teamId: string) => {
    console.log(`Клик по команде ID: ${teamId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Header activeTab="leaderboard" />
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2581FF]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-white text-2xl font-bold mb-2">
                Рейтинг команд
              </h2>
              <p className="text-white/60">
                Статистика команд по результатам турниров
              </p>
            </div>

            {data.teams.length > 0 ? (
              <TeamStatsTable 
                teams={data.teams} 
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
        )}
      </div>
    </div>
  );
}