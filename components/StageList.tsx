import StageCard from './StageCard';
import type { Stage } from '@/lib/types/stages';

interface StageListProps {
  stages: Stage[];
}

export default function StageList({ stages }: StageListProps) {
  if (stages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">
          Этапы не найдены
        </p>
        <p className="text-white/40 text-sm mt-2">
          Попробуйте изменить фильтры или создать новый этап
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Заголовок таблицы */}
      <div className="flex items-center gap-4 px-4 py-2 text-white/50 text-xs font-medium">
        <div className="flex-shrink-0 w-12">#</div>
        <div className="flex-shrink-0 w-32">Название</div>
        <div className="flex-1 min-w-0 truncate">Турнир</div>
        <div className="flex-shrink-0 w-10 text-center">Дисц</div>
        <div className="flex-shrink-0 w-40 truncate">Механика</div>
        <div className="flex-shrink-0 w-48">Текущий тур</div>
        <div className="flex-shrink-0 w-16 text-center">Команды</div>
        <div className="flex-shrink-0 w-40 text-center">Статус</div>
      </div>

      {/* Список этапов */}
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
