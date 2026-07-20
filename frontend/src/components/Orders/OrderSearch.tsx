"use client";

import { useOrderStore } from "@/store/orderStore";
import { Search, X } from "lucide-react";

export default function OrderSearch() {
  const { filters, setFilters } = useOrderStore();

  const handleClear = () => {
    setFilters({ query: "" });
  };

  return (
    <div className="relative select-none">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      
      <input
        type="text"
        value={filters.query}
        onChange={(e) => setFilters({ query: e.target.value })}
        placeholder="Search by Order ID, product name, or date..."
        className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 transition-all shadow-sm"
      />

      {filters.query && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
