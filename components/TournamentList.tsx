import type { Tournament } from '@/lib/types/tournaments';
import TournamentCard from './TournamentCard';

interface TournamentListProps {
  tournaments: Tournament[];
}

export default function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Турниры не найдены
        </h3>
        <p className="text-gray-400 text-sm">
          Пока нет созданных турниров
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
