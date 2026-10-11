"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Search, X, Filter } from "lucide-react";

interface AdminTableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
  rightActions?: ReactNode;
}

export default function AdminTableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  selectedCount = 0,
  bulkActions,
  onResetFilters,
  hasActiveFilters,
  className,
  rightActions,
}: AdminTableToolbarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-9 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter slots */}
        {filters && (
          <div className="flex flex-wrap items-center gap-2">
            {filters}

            {hasActiveFilters && onResetFilters && (
              <button
                onClick={onResetFilters}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {/* Right extra actions */}
        {rightActions && (
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            {rightActions}
          </div>
        )}
      </div>

      {/* Bulk actions banner if items are selected */}
      {selectedCount > 0 && bulkActions && (
        <div className="bg-blue-50 dark:bg-blue-950/40 p-3 sm:p-3.5 rounded-2xl border border-blue-200/80 dark:border-blue-900/80 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-black text-blue-900 dark:text-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{selectedCount} item{selectedCount > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {bulkActions}
          </div>
        </div>
      )}
    </div>
  );
}
