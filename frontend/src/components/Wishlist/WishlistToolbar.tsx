"use client";

import { useWishlistStore } from "@/store/wishlist";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function WishlistToolbar() {
  const { filters, setFilters, sort, setSort } = useWishlistStore();

  const categories = ["All", "Electronics", "Fashion", "Home"];
  const availabilities = ["All", "In Stock", "Out of Stock"];
  const sorts = ["Recently added", "Price low-high", "Price high-low", "Popular"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
      {/* 1. Search Bar */}
      <div className="relative md:col-span-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
          placeholder="Search saved products..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all"
        />
      </div>

      {/* 2. Filters */}
      <div className="flex items-center gap-3">
        {/* Category */}
        <div className="flex-1 flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 shadow-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="w-full bg-transparent focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div className="flex-1 flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 shadow-sm">
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ availability: e.target.value })}
            className="w-full bg-transparent focus:outline-none cursor-pointer"
          >
            {availabilities.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Sort */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 shadow-sm">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-transparent focus:outline-none cursor-pointer"
        >
          {sorts.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
