"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { User, Settings, Star } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useDashboardStore();

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
      <div className="flex items-center gap-4">
        {/* Profile Avatar Image */}
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/20 shrink-0 bg-gray-50 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-300" />
          )}
        </div>

        {/* User metadata */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              {user.name}
            </h2>
            <span className="flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              {user.membership}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold tracking-wide">
            Account Email: {user.email}
          </p>
        </div>
      </div>

      {/* Profile quick action */}
      <button className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0">
        <Settings className="w-3.5 h-3.5 text-gray-400" />
        Edit Profile Settings
      </button>
    </div>
  );
}
