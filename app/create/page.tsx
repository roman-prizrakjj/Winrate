import Header from '@/components/Header';
import CreateButtonsSection from './CreateButtonsSection';
import StagesSection from '@/components/StagesSection';
import { getAllStages } from '@/lib/services/stages';
import { adaptStages } from '@/lib/adapters/stages';

// ISR: кеш на 60 секунд (1 минута)
export const revalidate = 60;

/**
 * Загрузка этапов через SDK напрямую
 */
async function getStages() {
  try {
    console.log('[Create Page] Загрузка этапов через SDK...');
    
    const stages = await getAllStages();
    
    console.log(`[Create Page] Загружено этапов: ${stages.length}`);
    
    // Преобразуем SDK данные в формат компонентов
    return adaptStages(stages);
  } catch (error) {
    console.error('[Create Page] Ошибка загрузки этапов:', error);
    return [];
  }
}

export default async function CreatePage() {
  console.log(`[${new Date().toISOString()}] [Create ISR] Регенерация страницы...`);
  
  // Загружаем этапы на сервере
  const allStages = await getStages();

  console.log(`[Create Page Server] Отрисовка с ${allStages.length} этапами`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок с навигацией */}
        <div className="mb-8">
          <Header activeTab="create" />
        </div>

        {/* Кнопки создания */}
        <CreateButtonsSection />

        {/* Разделитель */}
        <div className="my-12 border-t border-white/10" />

        {/* Список этапов */}
        <StagesSection allStages={allStages} />
      </div>
    </div>
  );
}
