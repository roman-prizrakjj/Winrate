"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MatchList, { Match } from "@/components/MatchList";
import SearchInput from "@/components/SearchInput";
import { generateMockMatches } from "@/lib/mockData";
import { getAllDisciplines } from "@/lib/disciplines";
import { getTournaments, Tournament } from "@/lib/api";

interface DashboardData {
  matches: Match[];
}

export default function TournamentsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("Все");
  const [selectedTournament, setSelectedTournament] = useState<string>("Все");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    // Загрузка данных матчей и турниров
    const fetchData = async () => {
      try {
        // Загружаем турниры параллельно
        const tournamentsPromise = getTournaments();
        
        // Генерируем 100 матчей для демонстрации
        const mockMatches = generateMockMatches(100);

        // Ждем загрузки турниров
        const loadedTournaments = await tournamentsPromise;
        setTournaments(loadedTournaments);

        setTimeout(() => {
          setData({ matches: mockMatches });
          setFilteredMatches(mockMatches);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функция фильтрации матчей
  const applyFilters = (matches: Match[], search: string, discipline: string, tournament: string) => {
    let filtered = matches;

    // Фильтр по поисковому запросу
    if (search.trim() !== "") {
      filtered = filtered.filter(match => 
        match.team1.toLowerCase().includes(search.toLowerCase()) ||
        match.team2.toLowerCase().includes(search.toLowerCase()) ||
        match.tournament.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по дисциплине
    if (discipline !== "Все") {
      filtered = filtered.filter(match => match.discipline === discipline);
    }

    // Фильтр по турниру
    if (tournament !== "Все") {
      filtered = filtered.filter(match => match.tournament === tournament);
    }

    return filtered;
  };

  // Функция поиска команд
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!data) return;
    setFilteredMatches(applyFilters(data.matches, query, selectedDiscipline, selectedTournament));
  };

  // Функция изменения дисциплины
  const handleDisciplineChange = (discipline: string) => {
    setSelectedDiscipline(discipline);
    if (!data) return;
    setFilteredMatches(applyFilters(data.matches, searchQuery, discipline, selectedTournament));
  };

  // Функция изменения турнира
  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    if (!data) return;
    setFilteredMatches(applyFilters(data.matches, searchQuery, selectedDiscipline, tournament));
  };

  const handleMatchDetails = (matchId: string) => {
    console.log(`Просмотр деталей матча ID: ${matchId}`);
    // Здесь можно добавить логику перехода к деталям матча
  };

  // Функция обновления матча
  const handleUpdateMatch = (matchId: string, newTeam1: string, newTeam2: string) => {
    if (!data) return;

    console.log(`Обновление матча ${matchId}: ${newTeam1} vs ${newTeam2}`);
    
    // Обновляем данные матча
    const updatedMatches = data.matches.map(match => 
      match.id === matchId 
        ? { ...match, team1: newTeam1, team2: newTeam2 }
        : match
    );

    // Обновляем состояние
    const newData = { ...data, matches: updatedMatches };
    setData(newData);
    
    // Обновляем отфильтрованные матчи
    const updatedFiltered = filteredMatches.map(match => 
      match.id === matchId 
        ? { ...match, team1: newTeam1, team2: newTeam2 }
        : match
    );
    setFilteredMatches(updatedFiltered);

    // TODO: Здесь будет API запрос для сохранения в базе данных
    // await updateMatchInDatabase(matchId, newTeam1, newTeam2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок с навигацией */}
        <div className="mb-8">
                {/* Header */}
      <Header activeTab="tournaments" />
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
            {/* Заголовок секции и поиск */}
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">
                  Турнирные матчи
                </h2>
                <p className="text-white/60">
                  Список предстоящих и завершенных матчей
                </p>
              </div>

              {/* Фильтры и поиск */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                {/* Фильтр по дисциплинам */}
                <select
                  value={selectedDiscipline}
                  onChange={(e) => handleDisciplineChange(e.target.value)}
                  className="
                    bg-[#282E3B] text-white
                    border border-white/10 rounded-lg
                    px-4 py-2 min-w-[200px]
                    focus:outline-none focus:border-[#2581FF]
                    cursor-pointer
                  "
                >
                  <option value="Все">Все дисциплины</option>
                  {getAllDisciplines().map(discipline => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>

                {/* Фильтр по турнирам */}
                <select
                  value={selectedTournament}
                  onChange={(e) => handleTournamentChange(e.target.value)}
                  className="
                    bg-[#282E3B] text-white
                    border border-white/10 rounded-lg
                    px-4 py-2 min-w-[200px]
                    focus:outline-none focus:border-[#2581FF]
                    cursor-pointer
                  "
                >
                  <option value="Все">Все турниры</option>
                  {tournaments.map(tournament => (
                    <option key={tournament._id} value={tournament.title}>
                      {tournament.title}
                    </option>
                  ))}
                </select>

                {/* Поле поиска */}
                <SearchInput
                  placeholder="Поиск команд..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onSearch={handleSearch}
                  className="w-full max-w-md"
                />
              </div>
            </div>

            {/* Список матчей */}
            {filteredMatches.length > 0 ? (
              <MatchList 
                matches={filteredMatches} 
                onMatchDetails={handleMatchDetails}
                onUpdateMatch={handleUpdateMatch}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-white/50 text-lg">
                  {searchQuery ? "Команды не найдены" : "Нет доступных матчей"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
