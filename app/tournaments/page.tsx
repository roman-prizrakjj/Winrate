import Header from "@/components/Header";
import TournamentsPageClient from "./TournamentsPageClient";
import { getAllMatches } from "@/lib/services/matches";
import { getAllTeamsWithPlayers } from "@/lib/services/teams";
import { getAllCaptains } from "@/lib/services/captains";
import { adaptMatches } from "@/lib/adapters/matches";
import { getDisciplineNameById } from "@/lib/disciplines";

export const revalidate = 60; // ISR: ревалидация каждые 60 секунд

interface Tournament {
  _id: string;
  title: string;
}

interface Discipline {
  id: string;
  name: string;
}

export default async function TournamentsPage() {
  // Загружаем данные параллельно
  const [matches, teams, captains] = await Promise.all([
    getAllMatches(),
    getAllTeamsWithPlayers(),
    getAllCaptains(),
  ]);

  // Адаптируем матчи для UI (без механики)
  const adaptedMatches = adaptMatches(matches, teams);

  // Собираем уникальные турниры из матчей
  const tournamentsMap = new Map<string, { _id: string; title: string }>();
  
  adaptedMatches.forEach(match => {
    if (!tournamentsMap.has(match.stageId)) {
      tournamentsMap.set(match.stageId, {
        _id: match.stageId,
        title: match.stageName,
      });
    }
  });
  
  const tournaments: Tournament[] = Array.from(tournamentsMap.values());

  // Собираем уникальные дисциплины из матчей
  const disciplinesMap = new Map<string, { id: string; name: string }>();
  
  adaptedMatches.forEach(match => {
    if (!disciplinesMap.has(match.discipline)) {
      disciplinesMap.set(match.discipline, {
        id: match.discipline,
        name: getDisciplineNameById(match.discipline),
      });
    }
  });
  
  const disciplines: Discipline[] = Array.from(disciplinesMap.values());

  return (
    <div className="min-h-screen bg-[#1A1F2E]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TournamentsPageClient 
          allMatches={adaptedMatches}
          tournaments={tournaments}
          disciplines={disciplines}
          captains={captains}
        />
      </main>
    </div>
  );
}
