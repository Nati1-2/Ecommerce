"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { useAuthStore } from "@/store/auth";
import { User, Settings, Star } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeader({ onEditProfile }: { onEditProfile?: () => void }) {
  const { user: dashUser } = useDashboardStore();
  const { user: authUser } = useAuthStore();

  const user = {
    name: dashUser?.name || authUser?.name || authUser?.email?.split("@")[0] || "Customer",
    email: dashUser?.email || authUser?.email || "customer@example.com",
    avatar: dashUser?.avatar || "",
    membership: dashUser?.membership || "Standard Member ⭐",
  };

  return (
    <div className="p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
      <div className="flex items-center gap-4 min-w-0">
        {/* Profile Avatar Image */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/20 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          )}
        </div>

        {/* User metadata */}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
              {user.name}
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 px-2.5 py-0.5 rounded-full shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              {user.membership}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Header actions: Theme toggle & Edit profile */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        <ThemeToggle />
        <button
          onClick={onEditProfile}
          className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
