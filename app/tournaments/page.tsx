import Header from "@/components/Header";
import TournamentsPageClient from "./TournamentsPageClient";
import { getAllMatches } from "@/lib/services/matches";
import { getAllTeamsWithPlayers } from "@/lib/services/teams";
import { adaptMatches } from "@/lib/adapters/matches";
import { getDisciplineNameById } from "@/lib/disciplines";
import { CaptainsResponse } from "@/lib/types/captains";

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
  const [matches, teams, captainsData] = await Promise.all([
    getAllMatches(),
    getAllTeamsWithPlayers(),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/captains`, {
      next: { revalidate: 300 }
    }).then(res => res.json() as Promise<CaptainsResponse>)
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
          captains={captainsData.captains}
        />
      </main>
    </div>
  );
}
