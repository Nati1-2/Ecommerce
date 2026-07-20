"use client";

import { useSearchStore } from "@/store/searchStore";
import { LayoutGrid, List } from "lucide-react";

interface SearchToolbarProps {
  totalResults: number;
}

export default function SearchToolbar({ totalResults }: SearchToolbarProps) {
  const { sort, setSort, viewMode, setViewMode } = useSearchStore();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-100 mb-6 gap-4">
      <div className="text-sm font-medium text-gray-500">
        Showing <span className="font-bold text-gray-900">{totalResults}</span> results
      </div>

      <div className="flex items-center gap-4">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-500">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm font-bold text-gray-900 bg-transparent border-none focus:ring-0 py-1 pl-1 pr-6 cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="popular">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
