"use client";

import React from "react";
import {
  Search,
  RefreshCw,
  Play,
  Pause,
  PlusCircle,
  X,
  MousePointer,
  ShoppingCart,
  CreditCard,
  Layers,
  Heart,
  Tag,
} from "lucide-react";

interface UserActivityFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedEventType: string;
  setSelectedEventType: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  isAutoRefresh: boolean;
  setIsAutoRefresh: (val: boolean) => void;
  onRefresh: () => void;
  onSimulateClick: () => void;
  isSimulating: boolean;
  isFetching: boolean;
}

export default function UserActivityFilterBar({
  searchQuery,
  setSearchQuery,
  selectedEventType,
  setSelectedEventType,
  selectedRole,
  setSelectedRole,
  isAutoRefresh,
  setIsAutoRefresh,
  onRefresh,
  onSimulateClick,
  isSimulating,
  isFetching,
}: UserActivityFilterBarProps) {
  const eventTypeFilters = [
    { id: "all", label: "All Actions" },
    { id: "BUTTON_CLICK", label: "Buttons 🖱️" },
    { id: "LINK_CLICK", label: "Links 🔗" },
    { id: "ADD_TO_CART_CLICK", label: "Cart Clicks 🛒" },
    { id: "CHECKOUT_CLICK", label: "Checkout 💳" },
    { id: "SEARCH_SUBMIT", label: "Searches 🔍" },
    { id: "FILTER_CLICK", label: "Filters 🏷️" },
    { id: "DONATE_CLICK", label: "Donations 💖" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-4">
      {/* Top Controls: Search + Refresh + Simulation */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search element text (e.g. 'Add to Cart', 'Checkout'), user email, IP, or path..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right buttons: Auto Refresh, Manual Refresh, Simulate */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isAutoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title={isAutoRefresh ? "Pause Live Click Polling" : "Resume Live Click Polling"}
          >
            {isAutoRefresh ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live 3s</span>
                <Pause className="w-3 h-3 text-emerald-600 ml-0.5" />
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-500" />
                <span>Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh Ingress Clickstream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={onSimulateClick}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            title="Inject simulated live user click & action event"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isSimulating ? "Recording..." : "Simulate Click"}</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Action Type Pills + User Role Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Action Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {eventTypeFilters.map((opt) => {
            const isSelected = selectedEventType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedEventType(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Role Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400">User Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Users & Roles</option>
            <option value="CUSTOMER">👤 Customer</option>
            <option value="GUEST">🌐 Guest Visitor</option>
            <option value="VENDOR">🏪 Vendor</option>
            <option value="ADMIN">👑 Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
}
