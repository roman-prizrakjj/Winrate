"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import MatchList from "@/components/MatchList";
import SearchInput from "@/components/SearchInput";
import { MatchStatsIndicator } from "@/components/MatchStatsIndicator";
import MatchDetailsModal from "@/components/MatchDetailsModal";
import { AdaptedMatch } from "@/lib/types/matches";

interface Tournament {
  _id: string;
  title: string;
}

interface Discipline {
  id: string;
  name: string;
}

interface TournamentsPageClientProps {
  allMatches: AdaptedMatch[];
  tournaments: Tournament[];
  disciplines: Discipline[];
}

export default function TournamentsPageClient({ allMatches, tournaments, disciplines }: TournamentsPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [filteredMatches, setFilteredMatches] = useState<AdaptedMatch[]>(allMatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("Все");
  const [selectedTournament, setSelectedTournament] = useState<string>("Все");
  const [selectedTour, setSelectedTour] = useState<string>("Все");
  const [selectedMatch, setSelectedMatch] = useState<AdaptedMatch | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    'completed' | 'inProgress' | 'protests' | 
    'waiting' | 'playing' | 'waitingConfirmation' | 
    null
  >(null);

  // Получаем список туров для выбранного турнира
  const availableTours = useMemo(() => {
    if (selectedTournament === "Все") {
      return [];
    }
    
    // Фильтруем матчи по выбранному турниру и собираем уникальные туры
    const toursMap = new Map<string, { name: string; order: number }>();
    
    allMatches
      .filter(match => match.stageName === selectedTournament)
      .forEach(match => {
        if (!toursMap.has(match.tourName)) {
          toursMap.set(match.tourName, {
            name: match.tourName,
            order: match.tourOrder
          });
        }
      });
    
    // Сортируем по порядковому номеру
    return Array.from(toursMap.values()).sort((a, b) => a.order - b.order);
  }, [allMatches, selectedTournament]);

  // Функция фильтрации матчей
  const applyFilters = (
    matches: AdaptedMatch[], 
    search: string, 
    discipline: string, 
    tournament: string, 
    tour: string,
    statusFilter: 'completed' | 'inProgress' | 'protests' | 
                  'waiting' | 'playing' | 'waitingConfirmation' | 
                  null
  ) => {
    let filtered = matches;

    // Фильтр по поисковому запросу
    if (search.trim() !== "") {
      filtered = filtered.filter(match => 
        match.team1Name.toLowerCase().includes(search.toLowerCase()) ||
        match.team2Name.toLowerCase().includes(search.toLowerCase()) ||
        match.stageName.toLowerCase().includes(search.toLowerCase()) ||
        match.tourName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по дисциплине
    if (discipline !== "Все") {
      filtered = filtered.filter(match => match.discipline === discipline);
    }

    // Фильтр по турниру (через stageName, так как это часть турнира)
    if (tournament !== "Все") {
      filtered = filtered.filter(match => match.stageName === tournament);
    }

    // Фильтр по туру
    if (tour !== "Все") {
      filtered = filtered.filter(match => match.tourName === tour);
    }

    // Фильтр по статусу
    if (statusFilter) {
      // Старые фильтры (группы)
      if (statusFilter === 'completed') {
        filtered = filtered.filter(match => match.statusDisplay === "Игра завершена");
      } else if (statusFilter === 'inProgress') {
        filtered = filtered.filter(match => 
          match.statusDisplay === "Идёт игра" || 
          match.statusDisplay === "Ожидание игры" || 
          match.statusDisplay === "Ожидание подтверждения"
        );
      } else if (statusFilter === 'protests') {
        filtered = filtered.filter(match => match.statusDisplay === "Протест");
      }
      // Новые фильтры (конкретные статусы)
      else if (statusFilter === 'waiting') {
        filtered = filtered.filter(match => match.statusDisplay === "Ожидание игры");
      } else if (statusFilter === 'playing') {
        filtered = filtered.filter(match => match.statusDisplay === "Идёт игра");
      } else if (statusFilter === 'waitingConfirmation') {
        filtered = filtered.filter(match => match.statusDisplay === "Ожидание подтверждения");
      }
    }

    return filtered;
  };

  // Функция поиска команд
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredMatches(applyFilters(allMatches, query, selectedDiscipline, selectedTournament, selectedTour, selectedStatusFilter));
  };

  // Функция изменения дисциплины
  const handleDisciplineChange = (discipline: string) => {
    setSelectedDiscipline(discipline);
    setFilteredMatches(applyFilters(allMatches, searchQuery, discipline, selectedTournament, selectedTour, selectedStatusFilter));
  };

  // Функция изменения турнира
  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    // При смене турнира сбрасываем выбранный тур
    setSelectedTour("Все");
    setFilteredMatches(applyFilters(allMatches, searchQuery, selectedDiscipline, tournament, "Все", selectedStatusFilter));
  };

  // Функция изменения тура
  const handleTourChange = (tour: string) => {
    setSelectedTour(tour);
    setFilteredMatches(applyFilters(allMatches, searchQuery, selectedDiscipline, selectedTournament, tour, selectedStatusFilter));
  };

  const handleMatchDetails = (matchId: string) => {
    const match = allMatches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  };

  const handleCloseModal = () => {
    setSelectedMatch(null);
  };

  // Функция изменения фильтра по статусу
  const handleStatusFilterChange = (filter: 'completed' | 'inProgress' | 'protests' | 
                                             'waiting' | 'playing' | 'waitingConfirmation' | 
                                             null) => {
    setSelectedStatusFilter(filter);
    setFilteredMatches(applyFilters(allMatches, searchQuery, selectedDiscipline, selectedTournament, selectedTour, filter));
  };

  // Обновление данных матчей
  // Универсальное решение: работает на Vercel (через API) и на других платформах (router.refresh)
  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        // Пытаемся вызвать API ревалидации (для Vercel и подобных платформ)
        const response = await fetch('/api/revalidate-tournaments', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          console.log('[Refresh] Ревалидация через API успешна');
        } else {
          console.warn('[Refresh] API ревалидации вернул ошибку, используем fallback');
        }
      } catch (error) {
        // Если API недоступен (например, на self-hosted) - не проблема
        console.log('[Refresh] API недоступен, используем router.refresh() (нормально для non-Vercel)');
      } finally {
        // В любом случае вызываем router.refresh() - это работает на всех платформах
        router.refresh();
      }
    });
  };

  // Подсчет статистики матчей
  const matchStats = useMemo(() => {
    // Старая статистика (группы)
    const completed = filteredMatches.filter(match => match.statusDisplay === "Игра завершена").length;
    const protests = filteredMatches.filter(match => match.statusDisplay === "Протест").length;
    const inProgress = filteredMatches.filter(match => 
      match.statusDisplay === "Идёт игра" || 
      match.statusDisplay === "Ожидание игры" || 
      match.statusDisplay === "Ожидание подтверждения"
    ).length;

    // Новая детальная статистика
    const waiting = filteredMatches.filter(match => match.statusDisplay === "Ожидание игры").length;
    const playing = filteredMatches.filter(match => match.statusDisplay === "Идёт игра").length;
    const waitingConfirmation = filteredMatches.filter(match => match.statusDisplay === "Ожидание подтверждения").length;

    return { 
      completed, 
      inProgress, 
      protests,
      waiting,
      playing,
      waitingConfirmation
    };
  }, [filteredMatches]);

  return (
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

        {/* Индикатор статистики */}
        <div className="flex justify-center">
          <MatchStatsIndicator
            completed={matchStats.completed}
            inProgress={matchStats.inProgress}
            protests={matchStats.protests}
            waiting={matchStats.waiting}
            playing={matchStats.playing}
            waitingConfirmation={matchStats.waitingConfirmation}
            activeFilter={selectedStatusFilter}
            onFilterChange={handleStatusFilterChange}
          />
        </div>

        {/* Поле поиска */}
        <div className="flex justify-center">
          <SearchInput
            placeholder="Поиск команд..."
            value={searchQuery}
            onChange={handleSearch}
            onSearch={handleSearch}
            className="w-full max-w-md"
          />
        </div>

        {/* Фильтры */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
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

          {/* Фильтр по турам */}
          <select
            value={selectedTour}
            onChange={(e) => handleTourChange(e.target.value)}
            className="
              bg-[#282E3B] text-white
              border border-white/10 rounded-lg
              px-4 py-2 min-w-[200px]
              focus:outline-none focus:border-[#2581FF]
              cursor-pointer
            "
            disabled={selectedTournament === "Все"}
          >
            <option value="Все">Все туры</option>
            {availableTours.map(tour => (
              <option key={tour.name} value={tour.name}>
                {tour.name}
              </option>
            ))}
          </select>

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
            {disciplines.map(discipline => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>

          {/* Кнопка обновить */}
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="
              flex items-center gap-2 px-4 py-1.5 flex-shrink-0
              bg-[#2581FF] hover:bg-[#1a6edb] text-white
              rounded-[8px] text-[14px] font-medium whitespace-nowrap
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Обновить список матчей"
          >
            <span className={isPending ? 'animate-spin' : ''}>
              {isPending ? '⏳' : '🔄'}
            </span>
            <span>{isPending ? 'Обновление...' : 'Обновить'}</span>
          </button>
        </div>
      </div>

      {/* Список матчей */}
      {filteredMatches.length > 0 ? (
        <MatchList 
          matches={filteredMatches} 
          onMatchDetails={handleMatchDetails}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">
            {searchQuery ? "Матчи не найдены" : "Нет доступных матчей"}
          </p>
        </div>
      )}

      {/* Модальное окно с деталями матча */}
      {selectedMatch && (
        <MatchDetailsModal
          matchId={selectedMatch.id}
          team1Name={selectedMatch.team1Name}
          team2Name={selectedMatch.team2Name}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
