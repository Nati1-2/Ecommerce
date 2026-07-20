"use client";

import { UserStatsData } from "@/types/adminUser";
import { Users, UserCheck, UserX, UserPlus, TrendingUp } from "lucide-react";

interface Props {
  stats: UserStatsData;
}

export default function UserStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Registered Users",
      count: stats.totalUsers.toLocaleString(),
      growth: stats.usersGrowth,
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Platform Users",
      count: stats.activeUsers.toLocaleString(),
      growth: stats.activeGrowth,
      icon: UserCheck,
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Blocked / Suspended Accounts",
      count: stats.blockedUsers.toLocaleString(),
      growth: stats.blockedChange,
      icon: UserX,
      color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    },
    {
      title: "New Registrations Today",
      count: `+${stats.newUsersToday}`,
      growth: stats.todayGrowth,
      icon: UserPlus,
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{card.title}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{card.count}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  {card.growth > 0 ? `↑ ${card.growth}%` : `↓ ${Math.abs(card.growth)}%`} vs last month
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
