"use client";

import React from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  PlusCircle,
  LayoutList,
  Layers,
  X,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";
import { DeviceType, ActivityCategory } from "@/types/deviceTraffic";

interface DeviceFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDeviceType: string;
  setSelectedDeviceType: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  viewMode: "devices" | "activities";
  setViewMode: (val: "devices" | "activities") => void;
  isAutoRefresh: boolean;
  setIsAutoRefresh: (val: boolean) => void;
  onRefresh: () => void;
  onSimulateTraffic: () => void;
  isSimulating: boolean;
  isFetching: boolean;
}

export default function DeviceFilterBar({
  searchQuery,
  setSearchQuery,
  selectedDeviceType,
  setSelectedDeviceType,
  selectedStatus,
  setSelectedCategory,
  selectedCategory,
  setSelectedStatus,
  viewMode,
  setViewMode,
  isAutoRefresh,
  setIsAutoRefresh,
  onRefresh,
  onSimulateTraffic,
  isSimulating,
  isFetching,
}: DeviceFilterBarProps) {
  const deviceTypeOptions = [
    { id: "all", label: "All Devices" },
    { id: "Mobile", label: "Mobile", icon: Smartphone },
    { id: "Desktop", label: "Desktop", icon: Laptop },
    { id: "Tablet", label: "Tablet", icon: Tablet },
  ];

  const categoryOptions = [
    { id: "all", label: "All Activities" },
    { id: "cart", label: "🛒 Cart Actions" },
    { id: "checkout", label: "💳 Stripe Checkout" },
    { id: "browse", label: "👁️ Product Views" },
    { id: "search", label: "🔍 Catalog Searches" },
    { id: "auth", label: "👤 Customer Auth" },
    { id: "wishlist", label: "❤️ Wishlist Saves" },
    { id: "flash_sale", label: "⚡ Flash Deals" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-4">
      {/* Top Bar: Search + Primary Action Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exact device model, client IP, city, or activity..."
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

        {/* View Switcher: Devices Matrix vs Live Activity Stream */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
          <button
            onClick={() => setViewMode("devices")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "devices"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Connected Devices</span>
          </button>
          <button
            onClick={() => setViewMode("activities")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "activities"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Activity Stream</span>
          </button>
        </div>

        {/* Buttons: Auto Refresh, Manual Refresh, Simulate Event */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isAutoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title={isAutoRefresh ? "Pause Live Polling" : "Resume Live Polling"}
          >
            {isAutoRefresh ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live 5s</span>
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
            title="Refresh Ingress Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={onSimulateTraffic}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            title="Inject simulated real-time device traffic activity"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isSimulating ? "Streaming..." : "Simulate Traffic"}</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Device Type Pills + Status & Category Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Device Type Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {deviceTypeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedDeviceType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedDeviceType(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dropdowns: Activity Category & Status Filter */}
        <div className="flex items-center gap-2">
          {/* Activity Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Connection Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="online">🟢 Online (Active)</option>
            <option value="idle">🟡 Idle</option>
            <option value="exited">⚪ Exited</option>
          </select>
        </div>
      </div>
    </div>
  );
}
