"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { useAuthStore } from "@/store/auth";
import { User, Settings, Star } from "lucide-react";

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
    <div className="p-4 sm:p-6 border border-slate-200/80 rounded-2xl sm:rounded-3xl bg-white shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Profile Avatar Image */}
        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl sm:rounded-full overflow-hidden border-2 border-blue-500/20 shrink-0 bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center shadow-xs">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          )}
        </div>

        {/* User metadata */}
        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {user.name}
            </h2>
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              {user.membership}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
            {user.email}
          </p>
        </div>

        {/* Mobile quick edit icon button on small screens */}
        <div className="sm:hidden shrink-0">
          <button
            onClick={onEditProfile}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition-colors active:scale-95 cursor-pointer"
            title="Edit Profile"
            aria-label="Edit Profile"
          >
            <Settings className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Desktop header action: Edit profile */}
      <div className="hidden sm:flex items-center gap-2.5 shrink-0">
        <button
          onClick={onEditProfile}
          className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
