"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificationSearch() {
  const { filters, setFilter } = useNotificationStore();
  const [query, setQuery] = useState(filters.searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter({ searchQuery: query });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, setFilter]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search notifications..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#111827] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
