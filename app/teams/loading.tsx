/**
 * Индикатор загрузки для страницы команд
 * Показывается автоматически при загрузке Server Component
 */

export default function TeamsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-2">
              Команды университетов
            </h2>
            <p className="text-white/60">
              Загрузка данных команд...
            </p>
          </div>
        </div>

        {/* Спиннер загрузки */}
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2581FF]"></div>
        </div>
      </div>
    </div>
  );
}
