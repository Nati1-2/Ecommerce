"use client";

import { useOrderStore } from "@/store/orderStore";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderFilters() {
  const { filters, setFilters } = useOrderStore();

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
  const dates = ["Last 30 days", "Last 3 months", "Last year"];
  const sorts = ["Newest", "Oldest", "Highest price", "Lowest price"];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      {/* 1. Status chips list scroll */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {statuses.map((status) => {
          const isSelected = filters.status === status;

          return (
            <button
              key={status}
              onClick={() => setFilters({ status })}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shrink-0 border border-gray-100",
                isSelected
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900"
              )}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* 2. Date and Sort Dropdowns */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date Filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-150 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 shadow-sm shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filters.date}
            onChange={(e) => setFilters({ date: e.target.value })}
            className="bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {dates.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-150 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 shadow-sm shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value })}
            className="bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {sorts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
