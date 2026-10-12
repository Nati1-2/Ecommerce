"use client";

import { useState, useRef, useEffect } from "react";
import {
  Filter,
  Plus,
  X,
  RotateCcw,
  Monitor,
  Globe,
  Radio,
  MapPin,
  Calendar,
  Search,
  Check,
} from "lucide-react";
import VisitorCalendarPicker from "./VisitorCalendarPicker";
import { VisitorTimeframe } from "@/types/adminVisitors";

interface FilterBarProps {
  // Filter States
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSource: string;
  onSelectSource: (s: string) => void;
  selectedDevice: string;
  onSelectDevice: (d: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  startDate?: string;
  endDate?: string;
  timeframe: VisitorTimeframe | string;
  onSelectDateRange: (start: string | undefined, end: string | undefined, preset?: VisitorTimeframe) => void;
  onResetAllFilters: () => void;
  totalFilteredCount?: number;
  availableCountries?: { country: string; flag: string; count: number }[];
}

export default function VisitorFilterBar({
  searchQuery,
  onSearchChange,
  selectedSource,
  onSelectSource,
  selectedDevice,
  onSelectDevice,
  selectedStatus,
  onSelectStatus,
  selectedCountry,
  onSelectCountry,
  startDate,
  endDate,
  timeframe,
  onSelectDateRange,
  onResetAllFilters,
  totalFilteredCount,
  availableCountries = [],
}: FilterBarProps) {
  const [isAddFilterOpen, setIsAddFilterOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"root" | "device" | "source" | "status" | "country">("root");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAddFilterOpen(false);
        setActiveMenu("root");
      }
    }
    if (isAddFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddFilterOpen]);

  // Check which filters are actively applied
  const hasDateFilter = Boolean(startDate || endDate || (timeframe && timeframe !== "all"));
  const hasDeviceFilter = selectedDevice !== "all";
  const hasSourceFilter = selectedSource !== "all";
  const hasStatusFilter = selectedStatus !== "all";
  const hasCountryFilter = selectedCountry !== "all";
  const hasSearchFilter = Boolean(searchQuery.trim());

  const activeFiltersCount =
    (hasDateFilter ? 1 : 0) +
    (hasDeviceFilter ? 1 : 0) +
    (hasSourceFilter ? 1 : 0) +
    (hasStatusFilter ? 1 : 0) +
    (hasCountryFilter ? 1 : 0) +
    (hasSearchFilter ? 1 : 0);

  const deviceOptions = [
    { label: "All Devices", value: "all" },
    { label: "Desktop (PC)", value: "Desktop" },
    { label: "Mobile Smartphone", value: "Mobile" },
    { label: "Tablet", value: "Tablet" },
  ];

  const sourceOptions = [
    { label: "All Traffic Sources", value: "all" },
    { label: "Search Engines", value: "Search Engine" },
    { label: "Social Media", value: "Social Media" },
    { label: "Direct Access", value: "Direct" },
    { label: "External Referrals", value: "Referral" },
    { label: "Campaigns & Ads", value: "Campaign / Ad" },
  ];

  const statusOptions = [
    { label: "All Session Statuses", value: "all" },
    { label: "Online (Live)", value: "online" },
    { label: "Idle Session", value: "idle" },
    { label: "Exited", value: "exited" },
  ];

  const defaultCountries = [
    { country: "United States", flag: "🇺🇸", count: 0 },
    { country: "United Kingdom", flag: "🇬🇧", count: 0 },
    { country: "Germany", flag: "🇩🇪", count: 0 },
    { country: "Canada", flag: "🇨🇦", count: 0 },
    { country: "France", flag: "🇫🇷", count: 0 },
    { country: "Japan", flag: "🇯🇵", count: 0 },
    { country: "Netherlands", flag: "🇳🇱", count: 0 },
    { country: "Australia", flag: "🇦🇺", count: 0 },
    { country: "Brazil", flag: "🇧🇷", count: 0 },
    { country: "Ethiopia", flag: "🇪🇹", count: 0 },
  ];

  const countriesList = availableCountries.length > 0 ? availableCountries : defaultCountries;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Add Filter Button & Calendar Date Picker */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Calendar Date Picker Trigger */}
          <VisitorCalendarPicker
            startDate={startDate}
            endDate={endDate}
            timeframe={timeframe}
            onSelectDateRange={onSelectDateRange}
            onClear={() => onSelectDateRange(undefined, undefined, "all")}
          />

          {/* "+ Add Filter" Dropdown Menu */}
          <div className="relative inline-block" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setIsAddFilterOpen((prev) => !prev);
                setActiveMenu("root");
              }}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filter Selection Popover */}
            {isAddFilterOpen && (
              <div className="absolute left-0 mt-2 z-50 w-64 bg-white rounded-2xl p-2 border border-slate-200 shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {activeMenu === "root" && (
                  <>
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Filter Categories
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("device")}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-blue-600" />
                        <span>Device Type</span>
                      </span>
                      {hasDeviceFilter && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("source")}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-purple-600" />
                        <span>Traffic Source</span>
                      </span>
                      {hasSourceFilter && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("status")}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Session Status</span>
                      </span>
                      {hasStatusFilter && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenu("country")}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Visitor Country</span>
                      </span>
                      {hasCountryFilter && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </button>
                  </>
                )}

                {/* Submenu: Device Options */}
                {activeMenu === "device" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-slate-100 mb-1">
                      <span>Select Device</span>
                      <button
                        type="button"
                        onClick={() => setActiveMenu("root")}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                    {deviceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSelectDevice(opt.value);
                          setIsAddFilterOpen(false);
                          setActiveMenu("root");
                        }}
                        className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between ${
                          selectedDevice === opt.value
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedDevice === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Submenu: Source Options */}
                {activeMenu === "source" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-slate-100 mb-1">
                      <span>Select Traffic Source</span>
                      <button
                        type="button"
                        onClick={() => setActiveMenu("root")}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                    {sourceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSelectSource(opt.value);
                          setIsAddFilterOpen(false);
                          setActiveMenu("root");
                        }}
                        className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between ${
                          selectedSource === opt.value
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedSource === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Submenu: Status Options */}
                {activeMenu === "status" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-slate-100 mb-1">
                      <span>Select Session Status</span>
                      <button
                        type="button"
                        onClick={() => setActiveMenu("root")}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSelectStatus(opt.value);
                          setIsAddFilterOpen(false);
                          setActiveMenu("root");
                        }}
                        className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between ${
                          selectedStatus === opt.value
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedStatus === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Submenu: Country Options */}
                {activeMenu === "country" && (
                  <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-slate-100 mb-1 sticky top-0 bg-white">
                      <span>Select Country</span>
                      <button
                        type="button"
                        onClick={() => setActiveMenu("root")}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Back
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCountry("all");
                        setIsAddFilterOpen(false);
                        setActiveMenu("root");
                      }}
                      className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between ${
                        selectedCountry === "all"
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>🌐 All Countries</span>
                      {selectedCountry === "all" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    {countriesList.map((item) => (
                      <button
                        key={item.country}
                        type="button"
                        onClick={() => {
                          onSelectCountry(item.country);
                          setIsAddFilterOpen(false);
                          setActiveMenu("root");
                        }}
                        className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between ${
                          selectedCountry === item.country
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.country}</span>
                        </span>
                        {selectedCountry === item.country && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter IP, path, browser, city..."
            className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-slate-200/90 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Filters ({activeFiltersCount}):</span>
          </span>

          {/* Date Chip */}
          {hasDateFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-2xs">
              <Calendar className="w-3 h-3 text-blue-600" />
              <span>
                {startDate && endDate
                  ? `${startDate} to ${endDate}`
                  : startDate
                  ? `From ${startDate}`
                  : endDate
                  ? `Until ${endDate}`
                  : `Preset: ${timeframe}`}
              </span>
              <button
                type="button"
                onClick={() => onSelectDateRange(undefined, undefined, "all")}
                className="hover:text-blue-900 transition-colors"
                title="Remove date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Device Chip */}
          {hasDeviceFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-2xs">
              <Monitor className="w-3 h-3 text-slate-600" />
              <span>Device: {selectedDevice}</span>
              <button
                type="button"
                onClick={() => onSelectDevice("all")}
                className="hover:text-slate-900 transition-colors"
                title="Remove device filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Source Chip */}
          {hasSourceFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold shadow-2xs">
              <Globe className="w-3 h-3 text-purple-600" />
              <span>Source: {selectedSource}</span>
              <button
                type="button"
                onClick={() => onSelectSource("all")}
                className="hover:text-purple-900 transition-colors"
                title="Remove source filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Status Chip */}
          {hasStatusFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
              <Radio className="w-3 h-3 text-emerald-600" />
              <span>Status: {selectedStatus}</span>
              <button
                type="button"
                onClick={() => onSelectStatus("all")}
                className="hover:text-emerald-900 transition-colors"
                title="Remove status filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Country Chip */}
          {hasCountryFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-2xs">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Country: {selectedCountry}</span>
              <button
                type="button"
                onClick={() => onSelectCountry("all")}
                className="hover:text-amber-900 transition-colors"
                title="Remove country filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Search Chip */}
          {hasSearchFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-2xs">
              <Search className="w-3 h-3 text-slate-600" />
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="hover:text-slate-900 transition-colors"
                title="Clear search filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {/* Clear All Filters Button */}
          <button
            type="button"
            onClick={onResetAllFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
