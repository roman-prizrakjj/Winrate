"use client";

export interface TeamStats {
  id: string;
  position: number;
  name: string;
  tournamentId?: string | null;
  avatar?: string;
  wins: number;
  losses: number;
  draws: number;
  i: number; // дополнительная метрика
  cb: number; // дополнительная метрика  
  s: number; // дополнительная метрика
  winrate: number; // в процентах
}

interface TeamStatsTableProps {
  teams: TeamStats[];
  onTeamClick?: (teamId: string) => void;
}

export default function TeamStatsTable({ teams, onTeamClick }: TeamStatsTableProps) {
  const handleTeamClick = (teamId: string) => {
    if (onTeamClick) {
      onTeamClick(teamId);
    }
  };

  return (
    <div className="
      w-full
      flex flex-col
      rounded-[10px]
      overflow-hidden
    ">
      {/* Заголовок таблицы - точная копия структуры строки данных */}
      <div className="
        flex items-center gap-4
        px-5 py-5
        h-[67px]
        bg-[#343B4C]
        rounded-t-[10px]
      ">
        {/* № - точно как в строках */}
        <div className="
          w-10 h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
        ">
          №
        </div>

        {/* Команда - БЕЗ логотипа в заголовке */}
        <div className="
          w-[436px] h-[50px]
          flex items-center
        ">
          {/* Только название колонки */}
          <div className="
            text-white font-medium text-[20px] leading-[27px]
          ">
            Команда
          </div>
        </div>

        {/* W - точно как в строках */}
        <div className="
          w-[25px] h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          W
        </div>

        {/* Разделитель - точно как в строках */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* L */}
        <div className="
          w-[38px] h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          L
        </div>

        {/* Разделитель */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* D */}
        <div className="
          w-[40px] h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          D
        </div>

        {/* Разделитель */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* I (T) */}
        <div className="
          w-[45px] h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          T
        </div>

        {/* Разделитель */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* CB */}
        <div className="
          w-[40px] h-[27px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          CB
        </div>

        {/* Разделитель */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* S */}
        <div className="
          w-[40px] h-[20px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          S
        </div>

        {/* Разделитель */}
        <div className="
          w-[25px] h-0
          border border-white/10
          rotate-90
        "></div>

        {/* WR - как кнопка в строках */}
        <div className="
          w-[100px] h-[50px]
          flex items-center justify-center
          text-white font-medium text-[20px] leading-[27px]
          underline
        ">
          WR
        </div>
      </div>

      {/* Тело таблицы */}
      <div className="
        flex flex-col
        px-5 py-5
        gap-5
        bg-[#282E3B]
        rounded-b-[10px]
      ">
        {teams.map((team, index) => (
          <div
            key={team.id}
            onClick={() => handleTeamClick(team.id)}
            className="
              flex items-center gap-5
              h-[50px]
              hover:bg-white/5
              transition-colors duration-200
              cursor-pointer
              group
            "
          >
            {/* Позиция */}
            <div className="
              w-10 h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.position}
            </div>

            {/* Команда */}
            <div className="
              w-[559px] h-[50px]
              flex items-center gap-5
            ">
              {/* Логотип команды */}
              <div className="
                w-[50px] h-[50px]
                border-2 border-white/10
                backdrop-blur-[21px]
                rounded-[10px]
                flex items-center justify-center
                text-xs text-gray-600 font-bold
                flex-shrink-0
              ">
                {team.avatar ? (
                  <img 
                    src={team.avatar} 
                    alt={team.name}
                    className="w-full h-full rounded-[10px] object-cover"
                  />
                ) : (
                  "Н"
                )}
              </div>

              {/* Название команды */}
              <div className="
                flex-1
                text-white font-medium text-[20px] leading-[27px]
                truncate
              ">
                {team.name}
              </div>
            </div>

            {/* W */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.wins}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* L */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.losses}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* D */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.draws}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* I (T) */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.i}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* CB */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.cb}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* S */}
            <div className="
              w-[50px] h-[27px]
              flex items-center justify-center
              text-white font-medium text-[20px] leading-[27px]
            ">
              {team.s}
            </div>

            {/* Разделитель */}
            <div className="
              w-[25px] h-0
              border border-white/10
              rotate-90
            "></div>

            {/* WR - Кнопка */}
            <div className="
              flex items-center justify-center
              w-[92px] h-[50px]
              bg-white/10
              backdrop-blur-[21px]
              rounded-[10px]
              px-5 py-[10px]
            ">
              <div className="
                text-white font-medium text-[20px] leading-[27px]
                text-center
              ">
                {team.winrate}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
