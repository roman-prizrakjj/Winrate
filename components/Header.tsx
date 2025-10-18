"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  activeTab?: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const { user, logout } = useAuth();
  
  const tabs = [
    { id: "teams", label: "Команды", href: "/teams" },
    { id: "tournaments", label: "Турниры", href: "/tournaments" },
    { id: "leaderboard", label: "Лидерборд", href: "/leaderboard" },
  ];

  return (
    <header className="bg-[#282E3B] backdrop-blur-[21px] rounded-[10px] p-0">
      <div className="flex items-center justify-between px-10 py-0 gap-12 h-[114px]">
        {/* Логотип WINRATE */}
        <Link href="/" className="flex items-center">
          <div className="text-white font-bold text-2xl tracking-wide">
            WIN<span className="text-[#2581FF]">RATE</span>
          </div>
        </Link>

        {/* Навигационные вкладки */}
        <nav className="flex items-center gap-5 h-full">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex flex-col justify-center items-center 
                px-5 py-[15px] gap-2 h-full
                text-[15px] font-medium leading-5
                transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-[#2581FF]"
                    : "text-white/50 hover:text-white/80"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Информация о пользователе и кнопка выхода */}
        <div className="flex items-center gap-4">
          {/* Имя пользователя */}
          <div className="text-right">
            <div className="text-white font-medium text-sm">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.nickname || user?.email || 'Пользователь'
              }
            </div>
            <div className="text-gray-400 text-xs capitalize">
              {user?.role || 'player'}
            </div>
          </div>

          {/* Кнопка выхода */}
          <button 
            onClick={logout}
            className="
              flex items-center justify-center
              px-4 py-2 gap-2
              bg-red-600 backdrop-blur-[21px] rounded-[10px]
              text-white font-medium text-sm
              transition-colors duration-200
              hover:bg-red-700
              h-[54px] min-w-[99px]
            "
          >
            👋 Выход
          </button>
        </div>
      </div>
    </header>
  );
}